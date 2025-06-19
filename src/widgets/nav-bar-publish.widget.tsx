'use client';

import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { NavLink } from '@/components/nav-link.component';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CancelWidget } from './cancel.widget';
import { IMedia } from '@/interfaces/media.interface';

type Props = {
	media: IMedia;
	submit: () => void;
};

export function NavBarpublishWidget(props: Props) {
	const router = useRouter();
	const [cancelModal, setCancelModal] = useState(false);

	return (
		<nav className="h-[75px] w-full z-30 bg-gray-925 border-b border-white-10">
			<div className="flex flex-wrap h-full items-center justify-between mx-5">
				<div className="flex items-center justify-between h-full">
					<div
						className="cursor-pointer"
						onClick={() => router.push('/studio/media-catalogue', { scroll: false })}
					>
						<div className="flex h-12 w-12 bg-white-5 rounded-3xl justify-center items-center">
							<Icon name="chevron-left" className="" size="small" color="fill-gray-150" />
						</div>
					</div>
					<div className="p-2" />
					<ul className="flex space-x-4 mx-4 items-center h-full">
						<NavLink
							title="Library"
							click={() => router.push('/studio/media-catalogue', { scroll: false })}
						/>
						{props.media.metadata?.title && (
							<NavLink
								truncate="max-w-[450px]"
								title={props.media.metadata?.title}
								click={() => router.push(`/studio/media/${props.media.id}`, { scroll: false })}
							/>
						)}
						{!props.media.metadata?.title && (
							<NavLink
								truncate="max-w-[450px]"
								title={props.media?.name}
								click={() => router.push(`/studio/media/${props.media.id}`, { scroll: false })}
							/>
						)}
						<NavLink title="Publish" selected />
					</ul>
				</div>
				<div className="flex items-center">
					<Button type="secondary" iconColorType="secondary" onClick={() => setCancelModal(true)}>
						<Icon name="close-round" className="pr-[8px]" size="smedium" /> Cancel
					</Button>
					<CancelWidget
						isOpen={cancelModal}
						handleClose={() => setCancelModal(false)}
					></CancelWidget>
					<div className="p-1" />
					{/* <Button type="primary" iconColorType="primary-dark">
						<Icon name="eye" className="pr-[8px]" size="smedium" />
						Preview
					</Button> */}
					<div className="p-1" />
					<Button type="primary" onClick={() => props.submit()}>
						Publish
					</Button>
				</div>
			</div>
		</nav>
	);
}
