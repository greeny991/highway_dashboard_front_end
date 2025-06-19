'use client';

import { useEffect } from 'react';
import { AuthenticatorGuard } from '@/guards/authenticator.guard';
import { NavBarWidget } from '@/widgets/nav-bar.widget';

export default function PrivateLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	useEffect(() => {
		document.body.classList.remove('bg-gray-925');
		document.body.classList.add('bg-gray-468');
	}, []);

	return (
		<>
			<AuthenticatorGuard>
				<div className="fixed top-0 left-0 right-0 z-10">
					<NavBarWidget />
				</div>
				<div className="w-full h-full pt-[75px]">{children}</div>
			</AuthenticatorGuard>
		</>
	);
}
