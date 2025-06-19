'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaStatus } from '@/config/media-status.enum';
import { Icon } from '@/components/icon/icon.component';
import { InlineLoader } from '@/components/inline-loader/inline-loader.component';
import { ProcessingItem } from '@/contexts/media-manager.context';

interface Props {
	item: ProcessingItem;
}

export function ProgressItem(props: Props) {
	const router = useRouter();
	const [description, setDescription] = useState('');
	const [isPublication, setIsPublication] = useState(false);

	useEffect(() => {
		switch (props.item.status) {
			case MediaStatus.FINALIZE_ABR_MEZZANINE_IN_PROGRESS:
			case MediaStatus.TRANSCODING_IN_PROGRESS:
			case MediaStatus.WAITING_FINALIZE_ABR_MEZZANINE_START:
			case MediaStatus.WAITING_TRANSCODING_START:
				setIsPublication(false);
				setDescription('Processing');
				break;
			case MediaStatus.PUBLICATION_IN_PROGRESS:
				setIsPublication(true);
				setDescription('Publishing');
				break;
			case MediaStatus.ERROR:
				setDescription('error');
				break;
			case MediaStatus.READY:
				setDescription(isPublication ? 'Published' : 'Uploaded');
				break;
			case MediaStatus.UPLOAD_IN_PROGRESS:
			default:
				setIsPublication(false);
				setDescription('Uploading');
				break;
		}
	}, [props]);

	return (
		<div
			className={`flex flex-row justify-between h-[56px] rounded-lg w-full p-2.5 items-center
      ${props.item.status === MediaStatus.ERROR ? 'fill-red-200 text-red-200 bg-red-10' : 'bg-gray-650'}
      ${props.item.status !== MediaStatus.ERROR && props.item.status !== MediaStatus.READY && 'fill-gray-200 text-gray-200'}
      ${props.item.status === MediaStatus.READY && 'fill-white-100 text-white-100 cursor-pointer hover:bg-gray-500'}`}
			onClick={() => {
				if (props.item.status === MediaStatus.READY) {
					if (isPublication && props.item.publicationId) {
						router.push(`/studio/publication/${props.item.publicationId}`, { scroll: false });
					} else if (isPublication && !props.item.publicationId) {
						router.push('/studio/publications', { scroll: false });
					} else {
						router.push(`/studio/media/${props.item.mediaId}`, { scroll: false });
					}
				}
			}}
		>
			<div className={`flex flex-row items-center`}>
				<Icon name="document-upload" size="medium" />
				<label className="block m-2 text-[14px] font-light dark:text-white overflow-hidden w-[150px]">
					<span
						className={`block w-full truncate ${props.item.status === MediaStatus.READY && 'cursor-pointer '}`}
					>
						{props.item.name}
					</span>
				</label>
			</div>
			<div
				className={`flex flex-row items-center flex-shrink-0 pl-[10px]
        ${props.item.status !== MediaStatus.ERROR && props.item.status !== MediaStatus.READY && 'fill-green-200 text-green-200'}`}
			>
				<label className={`block text-[12px] font-light uppercase dark:text-white overflow-hidden`}>
					<span
						className={`line-clamp-1 ${props.item.status === MediaStatus.READY && 'cursor-pointer '}`}
					>
						{description}
					</span>
				</label>

				{props.item.status !== MediaStatus.ERROR && props.item.status !== MediaStatus.READY && (
					<div className="pl-[10px]">
						<InlineLoader size="small" />
					</div>
				)}

				{props.item.status === MediaStatus.ERROR && (
					<div className="pl-[10px]">
						<Icon
							name="close"
							size="small"
							className="flex h-[20px] w-[20px] items-center justify-center rounded-[2px] bg-red-20"
						/>
					</div>
				)}

				{props.item.status === MediaStatus.READY && (
					<div className="pl-[10px]">
						<Icon
							name="check"
							size="small"
							className="flex h-[20px] w-[20px] items-center justify-center rounded-[2px] bg-white-30"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
