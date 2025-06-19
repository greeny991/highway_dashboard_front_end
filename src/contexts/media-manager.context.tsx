'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MediaStatus } from '@/config/media-status.enum';
import { useDla } from '@/contexts/dla.context';
import { useMachine } from '@xstate/react';

import { IContentFabricFile } from '@/interfaces/content-fabric.interface';
import { useAuthenticator } from './authenticator/authenticator.context';
import {
	MediaManagerS3Machine as MediaManagerMachine,
	EParentMachinesEvents,
	EChildMachinesEvents
} from '@/machines/media-manager-s3.machine';

export type ProcessingItem = {
	id: string;
	name: string;
	status: string;
	mediaId?: string;
	publicationId?: string;
	fileUrl?: string;
};

type MediaManagerProviderProps = {
	children: ReactNode;
};

// export type MediaFile = {
//   video: IContentFabricFile;
//   thumbnails: IContentFabricFile[];
// }
export type MediaFile = {
	file: File;
	fileType?: string;
	cfThumbnail: File;
};

type MediaManagerContext = {
	clear: () => void;
	upload: (files: MediaFile[]) => void;
	monitorStatus: (items: ProcessingItem[]) => void;
	processingList: ProcessingItem[];
	updateStatusOnPublication: (id: string, status: MediaStatus) => void;
};

export function MediaManagerProvider({ children }: MediaManagerProviderProps) {
	const { MediaService, ContentFabricService } = useDla();
	const [processingList, setProcessingList] = useState<ProcessingItem[]>([]);
	const [state, send, service] = useMachine(MediaManagerMachine);
	const { authenticator } = useAuthenticator();

	// S3 useEffect
	useEffect(() => {
		if (service) {
			service.send({
				type: EParentMachinesEvents.TURN_ON
			});
		}
	}, [service]);

	useEffect(() => {
		updateStatus(state.context.machines);
	}, [state.context]);

	function addMachine(id: string, status: string) {
		service.send({
			type: EParentMachinesEvents.ADD_MACHINE,
			payload: {
				id,
				status
			}
		});
	}

	function sendToMachine(event: any, id: string, data?: any) {
		service.send({
			type: EParentMachinesEvents.SEND_TO_MACHINE,
			payload: {
				id: id,
				eventName: event,
				...(data && {
					data: { ...data }
				})
			}
		});
	}

	function upload(files: MediaFile[]): void {
		const mappedItems: ProcessingItem[] = files.map((media: MediaFile) => ({
			id: uuidv4(),
			// name: media.video.path,
			name: media.file.name,
			status: MediaStatus.UPLOAD_IN_PROGRESS
		}));

		setProcessingList([...processingList, ...mappedItems]);
		mappedItems.forEach((item, index) => {
			addMachine(item.id, MediaStatus.UPLOAD_IN_PROGRESS);
			// sendToMachine(EChildMachinesEvents.START_UPLOAD, item.id, {
			// 	files: files[index],
			// 	status: item.status,
			// 	mediaService: MediaService,
			// 	contentFabricService: ContentFabricService
			// });
			sendToMachine(EChildMachinesEvents.START_UPLOAD, item.id, {
				file: files[index].file,
				cfThumbnail: files[index].cfThumbnail,
				fileType: files[index].fileType || files[index].file.type,
				status: item.status
			});
		});
	}
	// function monitorStatus(items: ProcessingItem[]): void {
	//     setProcessingList([...processingList, ...items]);
	//     items.forEach((item) => {
	//       addMachine(item.id, item.status);
	//       sendToMachine(EChildMachinesEvents.START_CHECKING, item.id, {
	//         mediaService: MediaService,
	//         object: {
	//           id: item.id
	//         }
	//       });
	//     });
	//   }

	function monitorStatus(items: ProcessingItem[]): void {
		setProcessingList([...processingList, ...items]);
		// S3 uploads are usually one-shot, but you could add polling here if needed
	}

	function updateStatus(machines: any[]): void {
		const updatedprocessingList = processingList.map((item: ProcessingItem) => {
			const machine = machines.find((machine) => machine.id === item.id);

			item.status = machine.status;
			item.mediaId = machine.mediaId;
			item.fileUrl = machine.fileUrl;
			return item;
		});
		setProcessingList(updatedprocessingList);
	}

	function clear(): void {
		service.send({
			type: EParentMachinesEvents.REMOVE_MACHINES
		});
		setProcessingList([]);
	}

	function updateStatusOnPublication(id: string, status: MediaStatus) {
		const updatedProcessingList = processingList.map((item: ProcessingItem) => {
			if (item.id === id) {
				item.status = status;
			}
			return item;
		});
		setProcessingList(updatedProcessingList);
	}

	return (
		<MediaManagerContext.Provider
			value={{
				upload,
				clear,
				monitorStatus,
				updateStatusOnPublication,
				processingList
			}}
		>
			{children}
		</MediaManagerContext.Provider>
	);
}

export const MediaManagerContext = createContext({} as MediaManagerContext);

export function useMediaManager() {
	return useContext(MediaManagerContext);
}
