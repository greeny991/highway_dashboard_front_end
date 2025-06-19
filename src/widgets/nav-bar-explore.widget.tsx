'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { NavItem } from '@/components/nav-item.component';
import { useRouter } from 'next/navigation';
import { ProfileWidget } from '@/widgets/profile.widget';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { SearchBar } from '@/components/search-bar.component';
import { AuthenticationModalWidget } from '@/widgets/authentication-modal.widget';

export function NavBarExploreWidget() {
	const router = useRouter();
	const { authenticator } = useAuthenticator();
	const [authenticationModal, setAuthenticationModal] = useState(false);

	function redirectUserToStudio() {
		if (authenticator.user && authenticator.user.companyId) {
			router.push('/studio/media-catalogue', { scroll: false });
		}
	}

	return (
		<nav className="h-[75px] w-full z-30 bg-gray-468 border-b border-white-10">
			<div className="flex flex-wrap h-full items-center justify-between mx-5">
				<div className="flex items-center justify-between h-full">
					<div className="cursor-pointer" onClick={() => router.push('/', { scroll: false })}>
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
							title="Home"
							routes={['/']}
							click={() => {
								router.push('/', { scroll: false });
							}}
						/>
					</ul>
				</div>
				<div className="w-2/5">
					<SearchBar navBarSearch showFilterButton={false} />
				</div>
				<div className="flex items-center">
					{authenticator.user && <ProfileWidget />}
					{!authenticator.user && (
						<Button
							type="tertiary"
							iconColorType="primary"
							onClick={() => setAuthenticationModal(true)}
						>
							Join
							<Icon name="wallet" className="pl-[8px]" size="small" />
						</Button>
					)}

					{authenticationModal && (
						<AuthenticationModalWidget
							isOpen={authenticationModal}
							handleClose={() => {
								setAuthenticationModal(false);
								redirectUserToStudio();
							}}
						></AuthenticationModalWidget>
					)}
				</div>
			</div>
		</nav>
	);
}
