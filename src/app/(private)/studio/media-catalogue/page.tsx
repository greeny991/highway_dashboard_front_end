'use client';

import { useEffect, useState } from 'react';
import { EmptyCatalogue } from '@/components/empaty-catalogue.component';
import { MediaItem } from '@/components/media-item.component';
import { UploadMediaWidget } from '@/widgets/upload-media.widget';
import { MediaFile, ProcessingItem, useMediaManager } from '@/contexts/media-manager.context';
import { useDla } from '@/contexts/dla.context';
import { MediaStatus } from '@/config/media-status.enum';
import { IPaginationResult } from '@/interfaces/pagination.interface';
import { Loader } from '@/components/loader/loader.component';
import { IMedia } from '@/interfaces/media.interface';
import { GenerateVideoThumbnails } from '@/utils/generate-video-thumbnails';
import { VideoPlayerModal } from '@/components/video-player-modal.component';

export default function MediaCataloguePage() {
	const { upload, processingList } = useMediaManager();
	const { MediaService } = useDla();
	const [modelOpen, setModelOpen] = useState(false);
	const [mediaItems, setMediaItems] = useState<IMedia[]>([]);
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [selectedMedia, setSelectedMedia] = useState<null>(null);

	function fetchFinishedMedia(): void {
		setFetchInProgress(true);
		MediaService.getByStatus({
			status: [MediaStatus.READY, MediaStatus.PUBLICATION_IN_PROGRESS],
			perPage: 100
		})
			.then((data: IPaginationResult<IMedia>) => {
				setMediaItems(data.items);
				setFetchInProgress(false);
			})
			.catch(() => setFetchInProgress(false));
	}

	useEffect(() => {
		fetchFinishedMedia();
	}, []);

	useEffect(() => {
		const inProgress = processingList.filter(
			(item: ProcessingItem) =>
				item.status !== MediaStatus.READY && item.status !== MediaStatus.ERROR
		);

		if (processingList.length > 0 && inProgress.length === 0) {
			fetchFinishedMedia();
		}
	}, [processingList]);

	const handleCloseVideo = () => {
		setSelectedMedia(null);
	};

	return (
		<>
			{fetchInProgress && (
				<div className="w-full h-full">
					<Loader backdrop={false} />
				</div>
			)}

			{!fetchInProgress && mediaItems.length === 0 && (
				<div className="w-full h-full">
					<EmptyCatalogue addVideo={() => setModelOpen(true)}></EmptyCatalogue>
				</div>
			)}

			{mediaItems.length > 0 && (
				<div className="w-full grid grid-cols-2 lg:grid-cols-4 3xl:grid-cols-5 gap-4 p-4 pt-[75px]">
					{mediaItems.map((media: IMedia, index: number) => (
						<MediaItem key={index} media={media} refetch={fetchFinishedMedia} />
					))}
				</div>
			)}

			<UploadMediaWidget
				title="Add new video"
				isOpen={modelOpen}
				handleClose={() => setModelOpen(false)}
				multiple
				filesSelected={async (files: File[]) => {
					const mappedItems: MediaFile[] = [];
					for (const file of files) {
						const thumbnails = await GenerateVideoThumbnails(file);
						console.log('thumbnails', thumbnails);
						// mappedItems.push({
						// 	video: {
						// 		path: file.name,
						// 		mime_type: file.type,
						// 		size: file.size,
						// 		data: file
						// 	},
						// 	thumbnails: thumbnails.map((file: File) => ({
						// 		path: `thumbnails/${file.name}`,
						// 		mime_type: file.type,
						// 		size: file.size,
						// 		data: file
						// 	}))
						// });
						mappedItems.push({
							file,
							fileType: file.type,
							cfThumbnail: thumbnails[0]
						});
					}
					upload(mappedItems);
				}}
			></UploadMediaWidget>

			{selectedMedia && (
				<VideoPlayerModal
					isOpen={!!selectedMedia}
					media={selectedMedia}
					onClose={handleCloseVideo}
				/>
			)}
		</>
	);
}
