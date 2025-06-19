'use client';

import Image from 'next/image';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { NavLink } from '@/components/nav-link.component';
import { PublishModal } from '@/components/publish-modal/publish-modal.component';
import { IMedia } from '@/interfaces/media.interface';
import { ProfileWidget } from '@/widgets/profile.widget';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SharePrivatelyWidget } from './share-privately.widget';

type Props = {
	media: IMedia;
};

export function NavBarVideoPlayerWidget(props: Props) {
	const router = useRouter();
	const [publishAs, setpublishAs] = useState(false);
	const [shareModal, setShareModal] = useState(false);

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
						<NavLink
							title="Library"
							click={() => router.push('/studio/media-catalogue', { scroll: false })}
						/>
						{props.media.metadata?.title && (
							<NavLink title={props.media.metadata?.title} truncate="max-w-[450px]" selected />
						)}
						{!props.media.metadata?.title && (
							<NavLink title={props.media?.name} truncate="max-w-[450px]" selected />
						)}
					</ul>
				</div>
				<div className="flex items-center">
					<Button type="secondary">
						<Icon name="download" size="smedium" />
					</Button>
					<div className="p-1" />
					<Button
						type="secondary"
						iconColorType="secondary"
						onClick={() => router.push(`/studio/media/${props.media.id}/edit`, { scroll: false })}
					>
						<Icon name="edit" className="pr-[12px]" size="small" />
						Edit
					</Button>
					<div className="p-1" />
					<Button type="secondary" iconColorType="secondary" onClick={() => setShareModal(true)}>
						<Icon name="share" className="pr-[12px]" size="small" />
						Share
					</Button>

					{shareModal && (
						<SharePrivatelyWidget
							mediaId={props.media.cfMezzanineHash ?? ''}
							isOpen={shareModal}
							handleClose={() => setShareModal(false)}
						/>
					)}

					<div className="p-1" />
					<Button type="primary" iconColorType="primary-dark" onClick={() => setpublishAs(true)}>
						Publish
					</Button>
					<PublishModal isOpen={publishAs} handleClose={() => setpublishAs(false)}></PublishModal>
					<div className="p-1" />
					<ProfileWidget />
				</div>
			</div>
		</nav>
	);
}
