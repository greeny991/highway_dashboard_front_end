'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/button/button.component';
import { NavItem } from '@/components/nav-item.component';
import { UploadMediaWidget } from './upload-media.widget';
import { MediaFile, useMediaManager } from '@/contexts/media-manager.context';
import { useRouter } from 'next/navigation';
import { ProfileWidget } from '@/widgets/profile.widget';
import { DropdownMenu } from '@/components/dropdown-menu/dropdown-menu.component';
import { GenerateVideoThumbnails } from '@/utils/generate-video-thumbnails';

export function NavBarStudioWidget() {
	const { upload } = useMediaManager();
	const [uploadVideoModel, setUploadVideoModel] = useState(false);
	const router = useRouter();
	const dropdownTrigger = useRef<any>(null);
	const [showDropdownOptions, setShowDropdownOptions] = useState(false);

	return (
		<nav className="h-[75px] w-full z-30 bg-gray-925 border-b border-white-10">
			<div className="flex flex-wrap h-full items-center justify-between mx-5">
				<div className="flex items-center justify-between h-full">
					<div
						className="cursor-pointer"
						onClick={() => router.push('/studio/media-catalogue', { scroll: false })}
					>
						<Image
							src={'/icons/new-logo.svg'}
							alt="Hiway Logo"
							height={32}
							width={32}
							className="xl:w-[50px] xl:h-[50px]"
						/>
					</div>
					<div className="p-2" />
					<ul className="flex space-x-4 mx-4 items-center h-full">
						<NavItem
							title="Media Library"
							routes={['/studio/media-catalogue']}
							click={() => {
								router.push('/studio/media-catalogue', { scroll: false });
							}}
						/>
						<div className="relative flex h-full" ref={dropdownTrigger}>
							<NavItem
								title="Monetize"
								routes={[
									'/studio/publications-catalogue',
									'/studio/audience',
									'/studio/billing-revenue',
									'/studio/analytics'
								]}
							/>
							<DropdownMenu
								trigger={dropdownTrigger}
								changeState={(isOpened) => setShowDropdownOptions(isOpened)}
								items={[
									{
										name: 'Published Assets',
										click: () => {
											router.push('/studio/publications-catalogue', { scroll: false });
										}
									},
									{
										name: 'Audience',
										click: () => {
											router.push('/studio/audience', { scroll: false });
										}
									},
									{
										name: 'Billing & Revenue',
										click: () => {
											router.push('/studio/billing-revenue', { scroll: false });
										}
									},
									{
										name: 'Analytics',
										click: () => {
											router.push('/studio/analytics', { scroll: false });
										}
									},
									{
										name: 'Earnings',
										comingSoon: true,
										click: () => {}
									}
								]}
							/>
						</div>
					</ul>
				</div>
				<div className="flex items-center">
					<Button type="primary" onClick={() => setUploadVideoModel(true)}>
						Add new video
					</Button>
					{uploadVideoModel && (
						<UploadMediaWidget
							title="Add new video"
							isOpen={uploadVideoModel}
							handleClose={() => setUploadVideoModel(false)}
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
					)}
					<div className="p-2" />
					<ProfileWidget />
				</div>
			</div>
		</nav>
	);
}
