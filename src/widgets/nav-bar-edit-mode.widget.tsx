'use client';

import Image from 'next/image';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { NavLink } from '@/components/nav-link.component';
import { IMedia } from '@/interfaces/media.interface';
import { useRouter } from 'next/navigation';

type Props = {
	media: IMedia;
	submit: () => void;
};

export function NavBarEditModeWidget(props: Props) {
	const router = useRouter();

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
						<NavLink title="Edit" selected />
					</ul>
				</div>
				<div className="flex items-center">
					<Button
						type="secondary"
						iconColorType="secondary"
						onClick={() => {
							router.back();
						}}
					>
						<Icon name="close-round" className="pr-[8px]" size="smedium" />
						Cancel
					</Button>
					<div className="p-1" />
					<Button type="primary" iconColorType="primary-dark" onClick={() => props.submit()}>
						<Icon name="save" className="pr-[8px]" size="smedium" />
						Save changes
					</Button>
				</div>
			</div>
		</nav>
	);
}
