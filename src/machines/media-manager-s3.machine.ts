import { MediaStatus } from '@/config/media-status.enum';
import { assign, createMachine, createActor, fromPromise, setup, sendParent } from 'xstate';
import { getPresignedUrl } from '@/lib/api';
import { uploadMedia } from '@/lib/api';

// Reuse enums from media-manager.machine.ts
export enum EParentMachineStates {
	idle = 'idle',
	active = 'active',
	done = 'done'
}

export enum EParentMachinesEvents {
	TURN_ON = 'turn_on',
	TURN_OFF = 'turn_off',
	ADD_MACHINE = 'add_machine',
	SEND_TO_MACHINE = 'send_to_machine',
	REMOVE_MACHINES = 'remove_machines',
	UPDATE_STATUS = 'update_status'
}

export enum EChildMachineStates {
	idle = 'idle',
	creating = 'creating',
	uploading = 'uploading',
	finalizing = 'finalizing',
	ready = 'ready',
	failure = 'failure'
}

export enum EChildMachinesEvents {
	START_UPLOAD = 'start_upload'
}

// S3 Media Machine
export const MediaS3Machine = setup({}).createMachine({
	id: 'MediaS3Machine',
	initial: EChildMachineStates.idle,
	context: {},
	states: {
		[EChildMachineStates.idle]: {
			on: {
				[EChildMachinesEvents.START_UPLOAD]: {
					target: EChildMachineStates.creating,
					actions: assign({
						file: ({ event }) => event.payload.data?.file || {},
						status: ({ event }) => event.payload.data?.status || {},
						fileType: ({ event }) => event.payload.data?.fileType || 'video/mp4',
						cfThumbnail: ({ event }) => event.payload.data?.cfThumbnail || null
					})
				}
			}
		},
		[EChildMachineStates.creating]: {
			invoke: {
				id: 'get-presigned-urls',
				src: fromPromise(async ({ input: { file, fileType, cfThumbnail } }: any) => {
					// Get presigned URL for main file
					const resFile = await getPresignedUrl({ filename: file.name, type: fileType });
					if (!resFile.data?.uploadUrl)
						throw new Error(resFile.error?.message || 'No presigned URL for file');
					// Get presigned URL for thumbnail if present
					let thumbUploadUrl = null;
					let thumbFileUrl = null;
					if (cfThumbnail) {
						const resThumb = await getPresignedUrl({
							filename: cfThumbnail.name,
							type: cfThumbnail.type
						});
						if (!resThumb.data?.uploadUrl)
							throw new Error(resThumb.error?.message || 'No presigned URL for thumbnail');
						thumbUploadUrl = resThumb.data.uploadUrl;
						thumbFileUrl = resThumb.data.fileUrl;
					}
					return {
						uploadUrl: resFile.data.uploadUrl,
						fileUrl: resFile.data.fileUrl,
						file,
						thumbUploadUrl,
						thumbFileUrl,
						cfThumbnail
					};
				}),
				input: ({ context }: any) => ({
					file: context.file,
					fileType: context.fileType,
					cfThumbnail: context.cfThumbnail
				}),
				onDone: {
					target: EChildMachineStates.uploading,
					actions: assign({
						uploadUrl: ({ event }) => event.output.uploadUrl,
						fileUrl: ({ event }) => event.output.fileUrl,
						file: ({ event }) => event.output.file,
						thumbUploadUrl: ({ event }) => event.output.thumbUploadUrl,
						thumbFileUrl: ({ event }) => event.output.thumbFileUrl,
						cfThumbnail: ({ event }) => event.output.cfThumbnail
					})
				},
				onError: EChildMachineStates.failure
			}
		},
		[EChildMachineStates.uploading]: {
			invoke: {
				id: 'upload-to-s3',
				src: fromPromise(
					async ({ input: { file, uploadUrl, cfThumbnail, thumbUploadUrl } }: any) => {
						// Upload main file
						const resFile = await fetch(uploadUrl, {
							method: 'PUT',
							body: file,
							headers: {
								'Content-Type': file.type
							}
						});
						if (!resFile.ok) throw new Error('S3 upload failed');
						// Upload thumbnail if present
						if (cfThumbnail && thumbUploadUrl) {
							const resThumb = await fetch(thumbUploadUrl, {
								method: 'PUT',
								body: cfThumbnail,
								headers: {
									'Content-Type': cfThumbnail.type
								}
							});
							if (!resThumb.ok) throw new Error('S3 thumbnail upload failed');
						}
						return {};
					}
				),
				input: ({ context }: any) => ({
					file: context.file,
					uploadUrl: context.uploadUrl,
					cfThumbnail: context.cfThumbnail,
					thumbUploadUrl: context.thumbUploadUrl
				}),
				onDone: {
					target: EChildMachineStates.finalizing
				},
				onError: EChildMachineStates.failure
			}
		},
		[EChildMachineStates.finalizing]: {
			invoke: {
				id: 'store-in-backend',
				src: fromPromise(async ({ input: { file, fileUrl, thumbFileUrl } }: any) => {
					// Call backend to store file info, including thumbnail
					const res = await uploadMedia({
						name: file.name,
						fileUrl,
						cfThumbnail: thumbFileUrl
					});
					if (res.error) throw new Error(res.error.message || 'Failed to store in backend');
					return { fileUrl, thumbFileUrl };
				}),
				input: ({ context }: any) => ({
					file: context.file,
					fileUrl: context.fileUrl,
					thumbFileUrl: context.thumbFileUrl
				}),
				onDone: {
					actions: [
						assign({ status: () => MediaStatus.READY }),
						sendParent(({ context, self }: any) => ({
							type: EParentMachinesEvents.UPDATE_STATUS,
							payload: {
								status: context.status,
								machineId: self.id,
								origin: EChildMachineStates.finalizing,
								fileUrl: context.fileUrl,
								thumbFileUrl: context.thumbFileUrl
							}
						}))
					],
					target: EChildMachineStates.ready
				},
				onError: EChildMachineStates.failure
			}
		},
		[EChildMachineStates.failure]: {
			entry: [
				assign({
					status: () => MediaStatus.ERROR
				}),
				sendParent(({ context, self }: any) => ({
					type: EParentMachinesEvents.UPDATE_STATUS,
					payload: {
						status: context.status,
						machineId: self.id,
						origin: EChildMachineStates.failure
					}
				}))
			],
			type: 'final'
		},
		[EChildMachineStates.ready]: {
			type: 'final'
		}
	} as any
});

// S3 Media Manager Machine (parent)
export const MediaManagerS3Machine = createMachine({
	id: 'MediaManagerS3Machine',
	initial: EParentMachineStates.idle,
	context: {
		machines: []
	},
	states: {
		[EParentMachineStates.idle]: {
			on: {
				[EParentMachinesEvents.TURN_ON]: EParentMachineStates.active
			}
		},
		[EParentMachineStates.active]: {
			on: {
				[EParentMachinesEvents.TURN_OFF]: EParentMachineStates.done,
				[EParentMachinesEvents.ADD_MACHINE]: {
					actions: assign(({ context, event, self }) => {
						return {
							machines: [
								...context.machines,
								{
									id: event.payload.id,
									status: event.payload.status,
									ref: createActor(MediaS3Machine, {
										id: event.payload.id,
										parent: self
									}).start()
								}
							]
						};
					})
				},
				[EParentMachinesEvents.SEND_TO_MACHINE]: {
					actions: ({ context, event }: any) => {
						const machine = context.machines.find(
							(machine: any) => machine.id === event.payload.id
						);
						if (machine?.ref) {
							machine.ref.send({ ...event, type: event.payload.eventName });
						}
					}
				},
				[EParentMachinesEvents.REMOVE_MACHINES]: {
					actions: assign({
						machines: []
					})
				},
				[EParentMachinesEvents.UPDATE_STATUS]: {
					actions: assign({
						machines: ({ context, event }: any) => {
							return context.machines.map((machine: any) => {
								machine.origin = event.payload.origin;
								if (machine.id === event.payload.machineId) {
									machine.status = event.payload.status;
								}
								if (event.payload.fileUrl) {
									machine.fileUrl = event.payload.fileUrl;
								}
								return machine;
							});
						}
					})
				}
			}
		},
		[EParentMachineStates.done]: {
			type: 'final'
		}
	} as any
});
