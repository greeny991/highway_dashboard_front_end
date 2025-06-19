'use client';

import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { NavLink } from '@/components/nav-link.component';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { DeactivateWidget } from './deactivate.widget';
import { SmartLinkDropdown } from './smart-link-dropdown.widget';
import { SmartCodeDropdown } from './smart-code-dropdown.widget';
import { IPublication } from '@/interfaces/publication.interface';

type Props = {
	publication: IPublication;
};

export function NavBarCompletedPublishWidget(props: Props) {
	const router = useRouter();
	const [deactivateModal, setDeactivateModal] = useState(false);
	const [smartLinkModal, setSmartLinkModal] = useState(false);
	const [smartCodeModal, setSmartCodeModal] = useState(false);
	const linkDropdownTrigger = useRef<any>(null);
	const codeDropdownTrigger = useRef<any>(null);

	return (
		<nav className="h-[75px] w-full z-30 bg-gray-925 border-b border-white-10">
			<div className="flex flex-wrap h-full items-center justify-between mx-5">
				<div className="flex items-center justify-between h-full">
					<div
						className="cursor-pointer"
						onClick={() => router.push('/studio/publications-catalogue', { scroll: false })}
					>
						<div className="flex h-12 w-12 bg-white-5 rounded-3xl justify-center items-center">
							<Icon name="chevron-left" className="" size="small" color="fill-gray-150" />
						</div>
					</div>
					<div className="p-2" />
					<ul className="flex space-x-4 mx-4 items-center h-full">
						<NavLink
							title="Publications"
							click={() => router.push('/studio/publications-catalogue', { scroll: false })}
						/>
						<NavLink title={props.publication.displayName} truncate="max-w-[450px]" selected />
					</ul>
				</div>
				<div className="flex items-center">
					<Button type="secondary" onClick={() => setDeactivateModal(true)}>
						Deactivate Publishing
					</Button>
					<DeactivateWidget
						isOpen={deactivateModal}
						handleClose={() => setDeactivateModal(!deactivateModal)}
					></DeactivateWidget>
					<div className="p-1" />
					<div className="relative" ref={linkDropdownTrigger}>
						<Button type="primary" iconColorType="primary-dark">
							<Icon name="smart-link" className="pr-[8px]" size="smedium" />
							Get SmartLink
						</Button>
						<div className="right-0 top-16 absolute">
							<SmartLinkDropdown
								trigger={linkDropdownTrigger}
								changeState={(isOpened) => setSmartLinkModal(isOpened)}
								publicationId={props.publication.id}
							/>
						</div>
					</div>
					<div className="p-1" />
					<div className="relative" ref={codeDropdownTrigger}>
						<Button type="primary" iconColorType="primary-dark">
							<Icon name="smart-code" className="pr-[8px]" size="smedium" />
							Get SmartCode
						</Button>
						<div className="right-0 top-16 absolute">
							<SmartCodeDropdown
								trigger={codeDropdownTrigger}
								changeState={(isOpened) => setSmartCodeModal(isOpened)}
								publicationId={props.publication.id}
							/>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
