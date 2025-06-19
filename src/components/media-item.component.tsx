'use client';

import { Icon } from './icon/icon.component';
import { Dropdown } from './dropdown/dropdown.component';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IMedia } from '@/interfaces/media.interface';
import { SharePrivatelyWidget } from '@/widgets/share-privately.widget';
import { useDla } from '@/contexts/dla.context';
import { ErrorModelWidget } from '@/widgets/error.widget';

interface IProps {
	media: IMedia;
	refetch: () => void;
}

export function MediaItem({ media, refetch }: IProps) {
	const [showDropdownOptions, setShowDropdownOptions] = useState(false);
	const [shareModal, setShareModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);
	const [showError, setShowError] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const dropdownTrigger = useRef<any>(null);
	const router = useRouter();
	const { MediaService } = useDla();
	const title = media.metadata?.title ? media.metadata?.title : media.name;
	// const thumbnail = media.cfThumbnail
	// 	? process.env.NEXT_PUBLIC_CONTENT_FABRIC_BASE_URL_STATICS + media.cfThumbnail + '?width=764'
	// 	: '/images/default.png';
	const thumbnail = media.cfThumbnail ? media.cfThumbnail + '?width=764' : '/images/default.png';

	function removeExtension(filename: string): string {
		const parts = filename.split('.');
		return parts.length > 1 ? parts.slice(0, -1).join('.') : filename;
	}

	const handleDownload = async () => {
		try {
			// Create a temporary anchor element
			const link = document.createElement('a');
			link.href = media.fileUrl;
			link.download = media.name; // Use the original filename
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			setShowError(true);
		}
	};

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await MediaService.deleteById(media.id);
			refetch();
			setDeleteModal(false);
		} catch (error) {
			setShowError(true);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="relative w-full flex flex-col">
			<div className="w-full flex flex-row items-center justify-between text-[14px] font-primary font-medium text-white-100 overflow-hidden">
				<span className="truncate max-w-[300px]">{removeExtension(title)}</span>
				<button type="button" ref={dropdownTrigger}>
					<Icon
						name="ellipsis"
						size="large"
						className={`rounded-[8px] my-2
            ${showDropdownOptions ? 'bg-yellow-900 fill-gray-925' : 'fill-white-100 hover:bg-yellow-900 hover:fill-gray-925'}`}
					/>
				</button>
				<Dropdown
					trigger={dropdownTrigger}
					changeState={(isOpened) => setShowDropdownOptions(isOpened)}
					items={[
						{
							name: 'Edit',
							asset: 'edit',
							click: () => router.push(`/studio/media/${media.id}/edit`)
						},
						{ name: 'Share Privately', asset: 'send-privately', click: () => setShareModal(true) },
						{
							name: 'Publish',
							asset: 'publish',
							click: () => router.push(`/studio/media/${media.id}/publish`)
						},
						// { name: 'Transfer Ownership', asset: 'transfer-ownership', click: () => {} },
						{ name: 'Download', asset: 'download', click: handleDownload },
						{
							name: 'Delete',
							asset: 'delete',
							divider: true,
							danger: true,
							click: () => setDeleteModal(true)
						}
					]}
				/>
			</div>
			<div
				className="group"
				onClick={() => {
					router.push(`/studio/media/${media.id}`);
				}}
			>
				<div
					className={`group w-full aspect-[1.68/1] bg-gray-910 rounded-[8px] p-3 transition-all duration-100 ease-in-out cursor-pointer overflow-hidden
        ${showDropdownOptions ? 'p-0 border border-yellow-900' : 'group-hover:p-0 group-hover:border group-hover:border-yellow-900'}`}
				>
					<div
						className={`w-full h-full bg-gray-925 rounded-[8px] flex items-center justify-center`}
					>
						<img src={thumbnail} className="relative z-0 object-cover w-full h-full" />
					</div>
				</div>
			</div>

			{shareModal && (
				<SharePrivatelyWidget
					mediaId={media.id}
					isOpen={shareModal}
					handleClose={() => setShareModal(false)}
				/>
			)}

			{deleteModal && (
				<ErrorModelWidget
					isOpen={deleteModal}
					handleAction={handleDelete}
					handleClose={() => setDeleteModal(false)}
					action={isDeleting ? 'Deleting...' : 'Delete'}
					description="Are you sure you want to delete this media? This action cannot be undone."
					error="Delete Media"
				/>
			)}

			<ErrorModelWidget
				isOpen={showError}
				handleAction={() => setShowError(false)}
				handleClose={() => setShowError(false)}
				action="Close"
				description="Sorry, there was an error deleting the media. Please try again later."
			/>
		</div>
	);
}
