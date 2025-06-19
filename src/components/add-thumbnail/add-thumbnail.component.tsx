'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/icon/icon.component';
import { UploadMediaWidget } from '@/widgets/upload-media.widget';
import { Button } from '@/components/button/button.component';
import { useDla } from '@/contexts/dla.context';
import { IMedia } from '@/interfaces/media.interface';
import { Loader } from '@/components/loader/loader.component';
import { useUpload } from '@/contexts/upload.context';
import styles from './style.module.scss';
interface Props {
	media: IMedia;
	title: string;
	buttonText: string;
	uploadModalTitle: string;
	selectedSrc?: string;
	onChange: (src: string) => void;
	updateDefault?: boolean;
}

interface IThumbnails {
	id: string;
	url: string;
	isDefault: boolean;
	name?: string;
}

export function AddThumbnailItem(props: { onClick: () => void }) {
	const [isHovered, setIsHovered] = useState(false);
	const handleMouseEnter = () => setIsHovered(true);
	const handleMouseLeave = () => setIsHovered(false);

	return (
		<div
			className={`group w-[266px] h-[157px]  bg-[url('/images/dragdrop-bg.svg')] bg-cover rounded-[8px] cursor-pointer`}
			onClick={() => props.onClick()}
		>
			<div
				className={`w-full h-full rounded-[8px] p-2 flex items-center justify-center group-hover:bg-yellow-900 group-hover:bg-opacity-15 transition-all duration-30
  ${isHovered ? styles.linesBorderBoxYellow : styles.linesBorderBox}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<Icon
					name="add"
					size="medium"
					className="fill-gray-910 rounded-full p-2 bg-white-100 group-hover:bg-yellow-900"
				/>
			</div>
		</div>
	);
}

export function AddThumbnail(props: Props) {
	const upload = useUpload();
	const { MediaService } = useDla();
	const [showUploadMediaWidget, setShowUploadMediaWidget] = useState(false);
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [thumbnails, setThumbnails] = useState<IThumbnails[]>([]);
	const [selectedSrc, setSelectedSrc] = useState(props.selectedSrc);
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [saveInProgress, setSaveInProgress] = useState(false);

	function handleAssetResponse(assetMetadata: any): void {
		// const entries = Object.entries(assetMetadata);
		// const thumbnails: IThumbnails[] = [];
		// const defaultThumbnail: any = assetMetadata.default ? assetMetadata.default['/'] : undefined;

		// if (assetMetadata) {
		// 	entries.forEach(([key, value]: any) => {
		// 		if (key !== 'default') {
		// 			thumbnails.push({
		// 				src: `/q/${props.media.cfObjectId}/meta/public/asset_metadata/thumbnails/${key}`,
		// 				default: defaultThumbnail === value['/'],
		// 				name: ''
		// 			});
		// 		}
		// 	});
		// }

		setThumbnails(assetMetadata);
	}

	async function uploadThumbnails(files: File[]) {
		setSaveInProgress(true);

		const startIndex = thumbnails.length ? thumbnails.length + 1 : 1;
		// const mappedFiles = files.map((file: File, index: number) => {
		// 	const ext = file.name.split('.').pop();
		// 	const number = startIndex + index;
		// 	const mapped = {
		// 		name: `thumbnail_${number}.${ext}`,
		// 		path: `thumbnails/thumbnail_${number}.${ext}`,
		// 		mime_type: file.type,
		// 		size: file.size,
		// 		data: file
		// 	};

		// 	return mapped;
		// });

		// const assetMetadata = await upload.save({
		// 	data: { mediaId: props.media.id },
		// 	asset: 'thumbnails',
		// 	files: mappedFiles
		// });

		const assets = await Promise.all(
			files.map(async (file: File, index: number) => {
				const asset = await upload.uploadS3(file);
				return {
					url: asset ?? '',
					isDefault: false,
					name: file.name
				};
			})
		);

		const updatedThumbnails = await MediaService.addThumbnails(props.media.id, assets);

		handleAssetResponse(updatedThumbnails);
		setSaveInProgress(false);
	}

	useEffect(() => {
		if (showUploadModal) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}, [showUploadModal]);

	useEffect(() => {
		fetchThumbnails();
	}, []);

	const fetchThumbnails = async () => {
		const assetMetadata = await MediaService.getAllThumbnails(props.media.id);
		handleAssetResponse(assetMetadata);
		setFetchInProgress(false);
	};

	return (
		<div className="relative w-full flex flex-row gap-4">
			{!selectedSrc && (
				<div className="w-[266px] h-[157px]">
					<AddThumbnailItem onClick={() => setShowUploadModal(true)} />
				</div>
			)}

			{selectedSrc && (
				<div className="flex items-center w-full">
					<div
						className={`group w-[266px] h-[157px] rounded-[8px] flex justify-center items-center overflow-hidden border border-yellow-900`}
					>
						<img src={selectedSrc} className="w-full h-full object-cover" />
					</div>
					<div className="h-full flex justify-center items-center pl-[25px]">
						<Button type="secondary" fluid onClick={() => setShowUploadModal(true)}>
							Change
						</Button>
					</div>
				</div>
			)}

			{showUploadModal && (
				<div className="fixed top-0 left-0 w-full h-full z-40 bg-gray-925/60 flex justify-end">
					<div className="relative w-[940px] h-full bg-gray-800 flex flex-col pl-[48px] pt-[48px]">
						{saveInProgress && (
							<div className="absolute w-full h-full top-0 left-0 right-0 z-50">
								<Loader backdrop={true} />
							</div>
						)}

						{fetchInProgress && (
							<div className="w-full h-full pr-[48px] pb-[48px] flex justify-center items-center">
								<Loader backdrop={false} />
							</div>
						)}

						{!fetchInProgress && (
							<>
								<div className="w-full flex items-center pb-[40px]">
									<div className="bg-green-200/15 w-[32px] h-[32px] flex justify-center items-center rounded-[50%]">
										<Icon name="plus" color="fill-green-200" />
									</div>
									<div className="pl-[15px] text-white-100 text-[16px] uppercase tracking-[0.4px] font-medium">
										{props.title}
									</div>
									<div
										className="flex-1 flex items-center justify-end mr-[48px] cursor-pointer group"
										onClick={() => setShowUploadModal(false)}
									>
										<Icon
											name="close"
											color="fill-gray-200 group-hover:fill-gray-400"
											size="medium"
										/>
									</div>
								</div>
								<div className="w-full flex-1 align-middle overflow-x-auto pr-[48px]">
									<div className="w-full grid grid-cols-3 gap-4">
										<AddThumbnailItem onClick={() => setShowUploadMediaWidget(true)} />
										{thumbnails.map((item: IThumbnails, index) => (
											<div
												key={index}
												className={`
                      relative group w-[266px] h-[157px] rounded-[8px] flex justify-center items-center overflow-hidden border-2 border-transparent cursor-pointer
                      ${item.isDefault && 'border-yellow-900'}
                      ${!item.isDefault && 'hover:border-green-200'}
                    `}
												onClick={async () => {
													if (!item.isDefault) {
														props.onChange(item.url);
														if (props.updateDefault) {
															await MediaService.setDefaultThumbnail(item.id);
															await fetchThumbnails();
														}
														setSelectedSrc(item.url);
														setShowUploadModal(false);
													}
												}}
											>
												<img src={item.url} className="w-full h-full object-cover relative z-10" />
												{item.isDefault && (
													<div className="absolute z-20 top-[15px] right-[15px] uppercase bg-yellow-900/90 h-[25px] text-[11px] flex items-center px-[15px] rounded-[5px] font-medium">
														default
													</div>
												)}
												{!item.isDefault && (
													<div className="absolute hidden group-hover:flex z-20 bottom-[15px] left-[50%] -translate-x-1/2 uppercase bg-green-200/90 h-[25px] text-[11px] items-center px-[15px] rounded-[5px] font-medium whitespace-nowrap">
														{props.buttonText}
													</div>
												)}
											</div>
										))}
									</div>
									<div className="w-full h-[48px]"></div>
								</div>
							</>
						)}
					</div>
				</div>
			)}

			<UploadMediaWidget
				title={props.uploadModalTitle}
				isOpen={showUploadMediaWidget}
				handleClose={() => setShowUploadMediaWidget(false)}
				accept="image/*, image/gif, image/jpeg"
				filesSelected={(files: File[]) => uploadThumbnails(files)}
				multiple
			></UploadMediaWidget>
		</div>
	);
}
