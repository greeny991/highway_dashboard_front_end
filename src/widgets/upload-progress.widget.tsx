'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { ProgressItem } from '@/components/progress-item.component';
import { ProcessingItem, useMediaManager } from '@/contexts/media-manager.context';
import { MediaStatus } from '@/config/media-status.enum';
import { useDla } from '@/contexts/dla.context';
import { IMedia } from '@/interfaces/media.interface';
import { IPaginationResult } from '@/interfaces/pagination.interface';

export function UploadProgressWidget() {
	const { MediaService } = useDla();
	const { processingList, monitorStatus, clear } = useMediaManager();
	const [isExpanded, setIsExpanded] = useState(false);
	const [showCloseButton, setShowCloseButton] = useState(false);
	const [showWarning, setShowWarning] = useState(false);

	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	useEffect(() => {
		let totalFinished = 0;
		let totalUploading = 0;

		processingList.forEach((item) => {
			if (item.status === MediaStatus.ERROR || item.status === MediaStatus.READY) {
				totalFinished++;
			}
			if (item.status === MediaStatus.UPLOAD_IN_PROGRESS) {
				totalUploading++;
			}
		});

		setIsExpanded(true);
		setShowCloseButton(processingList.length === totalFinished);
		setShowWarning(totalUploading > 0);
	}, [processingList]);

	useEffect(() => {
		MediaService.getByStatus({
			status: [
				MediaStatus.WAITING_TRANSCODING_START,
				MediaStatus.TRANSCODING_IN_PROGRESS,
				MediaStatus.WAITING_FINALIZE_ABR_MEZZANINE_START,
				MediaStatus.FINALIZE_ABR_MEZZANINE_IN_PROGRESS,
				MediaStatus.PUBLICATION_IN_PROGRESS
			],
			perPage: 100
		}).then((data: IPaginationResult<IMedia>) => {
			const items: ProcessingItem[] = data.items.map((item) => ({
				id: item.id,
				name: item.metadata?.title || item.name,
				status: item.status,
				mediaId: item.id
			}));

			monitorStatus(items);
		});
	}, []);

	return (
		<>
			{processingList.length > 0 && (
				<div className="max-w-[348px] flex flex-col gap-2 p-2 rounded-[8px] bg-gray-850 shadow-lg">
					<div
						className={`flex flex-row justify-between h-[56px] rounded-lg w-full p-2.5 items-center bg-gray-650`}
					>
						<label className="block m-2 text-[14px] font-light dark:text-white uppercase overflow-hidden text-white-100">
							<span className="line-clamp-1">Media Status</span>
						</label>
						<div className="p-2" />
						<div className={`flex flex-row items-center`}>
							<Button type="icon" square onClick={toggleExpand}>
								<Icon
									name={isExpanded ? 'chevron-down' : 'chevron-up'}
									size="medium"
									className="hover:fill-white-100"
								/>
							</Button>
							{showCloseButton && (
								<Button type="icon" square onClick={clear}>
									<Icon name="close" size="medium" className="hover:fill-white-100" />
								</Button>
							)}
						</div>
					</div>

					{showWarning && (
						<div className={`flex rounded-lg w-full items-center bg-yellow-250 text-yellow-900`}>
							<label className="block m-2 text-[14px] font-light">
								Please keep the application open during the uploading process.
							</label>
							<div className="p-2" />
						</div>
					)}

					{isExpanded && (
						<div className="flex flex-col gap-2">
							{processingList.map((item, index) => (
								<ProgressItem key={index} item={item}></ProgressItem>
							))}
						</div>
					)}
				</div>
			)}
		</>
	);
}
