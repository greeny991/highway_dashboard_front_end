'use client';

import { Button } from '@/components/button/button.component';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { useDla } from '@/contexts/dla.context';
import { Loader } from '@/components/loader/loader.component';
import { useState } from 'react';

export default function LogoutButton() {
	const { authenticator } = useAuthenticator();
	const [signoutInProgress, setSignoutInProgress] = useState(false);

	async function signout(): Promise<void> {
		setSignoutInProgress(true);
		await authenticator.signout();
		window.location.replace('/');
	}

	return (
		<>
			{signoutInProgress && (
				<div className="fixed w-full h-full top-0 left-0 z-50">
					<Loader />
				</div>
			)}
			<div className="absolute top-[20px] right-[20px]">
				<Button type="tiny" onClick={() => signout()}>
					Logout
				</Button>
			</div>
		</>
	);
}
