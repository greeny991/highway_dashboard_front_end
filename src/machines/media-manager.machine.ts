import { MediaStatus } from '@/config/media-status.enum';
import {
	assign,
	createMachine,
	createActor,
	fromPromise,
	setup,
	sendParent,
	stopChild
} from 'xstate';

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
	checking = 'checking',
	retrying = 'retrying',
	ready = 'ready',
	failure = 'failure'
}

export enum EChildMachinesEvents {
	START_UPLOAD = 'start_upload',
	START_CHECKING = 'start_checking'
}

// State machine manager
export const MediaManagerMachine = createMachine({
	id: 'MediaManagerMachine',
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
									ref: createActor(MediaMachine, {
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
								if (event.payload.mediaId) {
									machine.mediaId = event.payload.mediaId;
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

// Media machine
export const MediaMachine = setup({
	delays: {
		checking_timeout: ({ context }: any) => context.delayInMilliseconds
	}
}).createMachine({
	id: 'MediaMachine',
	initial: EChildMachineStates.idle,
	context: {},
	states: {
		[EChildMachineStates.idle]: {
			on: {
				[EChildMachinesEvents.START_UPLOAD]: {
					target: EChildMachineStates.creating,
					actions: assign({
						files: ({ event }) => event.payload.data?.files || {},
						status: ({ event }) => event.payload.data?.status || {},
						mediaService: ({ event }) => event.payload.data?.mediaService || {},
						contentFabricService: ({ event }) => event.payload.data?.contentFabricService || {}
					})
				},
				[EChildMachinesEvents.START_CHECKING]: {
					target: EChildMachineStates.checking,
					actions: assign({
						mediaService: ({ event }) => event.payload.data?.mediaService || {},
						object: ({ event }) => event.payload.data?.object || {}
					})
				}
			}
		},
		[EChildMachineStates.creating]: {
			invoke: {
				id: 'creating',
				src: fromPromise(({ input: { files, mediaService } }: any) =>
					mediaService.create(files.video.path)
				),
				input: ({ context }: any) => ({
					files: context.files,
					mediaService: context.mediaService
				}),
				onDone: {
					target: EChildMachineStates.uploading,
					actions: [
						sendParent(({ context, self, event }: any) => ({
							type: EParentMachinesEvents.UPDATE_STATUS,
							payload: {
								status: context.status,
								machineId: self.id,
								origin: EChildMachineStates.creating,
								mediaId: event.output.id
							}
						})),
						assign({
							object: ({ event }) => event.output
						})
					]
				},
				onError: EChildMachineStates.failure
			}
		},
		[EChildMachineStates.uploading]: {
			invoke: {
				id: 'uploading',
				src: fromPromise(async ({ input: { files, object, contentFabricService } }: any) => {
					await contentFabricService.createInstance({
						node: object.contentFabricObject.node,
						token: object.contentFabricObject.authorizationToken
					});

					return contentFabricService.upload({
						files: [files.video, ...files.thumbnails],
						objectId: object.contentFabricObject.id,
						libraryId: object.contentFabricObject.libraryId,
						writeToken: object.contentFabricObject.writeToken
					});
				}),
				input: ({ context }: any) => ({
					files: context.files,
					object: context.object,
					contentFabricService: context.contentFabricService
				}),
				onDone: {
					target: EChildMachineStates.finalizing,
					actions: sendParent(({ context, self }: any) => ({
						type: EParentMachinesEvents.UPDATE_STATUS,
						payload: {
							status: context.status,
							machineId: self.id,
							origin: EChildMachineStates.uploading
						}
					}))
				},
				onError: EChildMachineStates.failure
			}
		},
		[EChildMachineStates.finalizing]: {
			invoke: {
				id: 'finalizing',
				src: fromPromise(({ input: { id, mediaService } }: any) => mediaService.finalize(id)),
				input: ({ context }: any) => ({
					id: context.object.id,
					mediaService: context.mediaService
				}),
				onDone: {
					target: EChildMachineStates.checking,
					actions: [
						assign({
							status: ({ event }) => MediaStatus.WAITING_TRANSCODING_START
						}),
						sendParent(({ context, self }: any) => ({
							type: EParentMachinesEvents.UPDATE_STATUS,
							payload: {
								status: context.status,
								machineId: self.id,
								origin: EChildMachineStates.finalizing
							}
						}))
					]
				},
				onError: EChildMachineStates.failure
			}
		},
		[EChildMachineStates.checking]: {
			invoke: {
				id: 'checking',
				src: fromPromise(({ input: { id, mediaService } }: any) => mediaService.getById(id)),
				input: ({ context, event }: any) => ({
					id: context.object.id,
					mediaService: context.mediaService
				}),
				onDone: [
					{
						target: EChildMachineStates.ready,
						guard: ({ event }: any) => {
							console.log(event.output);
							return event.output.status === MediaStatus.READY;
						}
					},
					{
						target: EChildMachineStates.failure,
						guard: ({ event }: any) => event.output.status === MediaStatus.ERROR
					},
					{
						target: EChildMachineStates.retrying,
						guard: ({ event }: any) =>
							event.output.timeLeftInSeconds !== 0 ||
							(event.output.timeLeftInSeconds === 0 &&
								event.output.status !== MediaStatus.READY &&
								event.output.status !== MediaStatus.ERROR),
						actions: [
							assign({
								status: ({ event }) => event.output.status,
								delayInMilliseconds: ({ event }) => {
									return event.output.timeLeftInSeconds <= 0
										? 30000
										: event.output.timeLeftInSeconds * 1000;
								}
							}),
							sendParent(({ context, self }: any) => ({
								type: EParentMachinesEvents.UPDATE_STATUS,
								payload: {
									status: context.status,
									machineId: self.id,
									origin: EChildMachineStates.checking,
									mediaId: context.object.id
								}
							}))
						]
					}
				],
				onError: EChildMachineStates.failure
			}
		},
		[EChildMachineStates.retrying]: {
			after: {
				checking_timeout: {
					target: EChildMachineStates.checking
				}
			}
		},
		[EChildMachineStates.failure]: {
			type: 'final',
			entry: [
				assign({
					status: ({ context }) => MediaStatus.ERROR
				}),
				sendParent(({ context, self }: any) => ({
					type: EParentMachinesEvents.UPDATE_STATUS,
					payload: {
						status: context.status,
						machineId: self.id,
						origin: EChildMachineStates.failure
					}
				}))
			]
		},
		[EChildMachineStates.ready]: {
			type: 'final',
			entry: [
				assign({
					status: ({ context }) => MediaStatus.READY
				}),
				sendParent(({ context, self }: any) => ({
					type: EParentMachinesEvents.UPDATE_STATUS,
					payload: {
						status: context.status,
						machineId: self.id,
						origin: EChildMachineStates.ready
					}
				}))
			]
		}
	} as any
});
