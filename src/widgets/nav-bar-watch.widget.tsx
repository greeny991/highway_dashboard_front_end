'use client';

import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { useState } from 'react';
import { AuthenticationModalWidget } from './authentication-modal.widget';
import { ProfileWidget } from '@/widgets/profile.widget';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import Image from 'next/image';

export function NavBarWatchWidget() {
	const { authenticator } = useAuthenticator();
	const [authenticationModal, setAuthenticationModal] = useState(false);

	return (
		<nav className="h-[75px] w-full z-30">
			<div className="bg-black xl:bg-transparent flex flex-wrap h-full items-center justify-between px-5">
				<div className="w-[128px] xl:w-[172px] h-6 xl:h-8">
					<div className="h-full w-full">
						<Image src="/images/logo-with-text-hiway.svg" alt="HiWay" height={40} width={130} />
					</div>
				</div>

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
						handleClose={() => setAuthenticationModal(false)}
					></AuthenticationModalWidget>
				)}
			</div>
		</nav>
	);
}
