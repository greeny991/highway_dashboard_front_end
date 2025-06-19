'use client';

import { useEffect } from 'react';
import { AuthenticatorGuard } from '@/guards/authenticator.guard';
import { UploadProgressWidget } from '@/widgets/upload-progress.widget';

export default function PrivateLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	useEffect(() => {
		document.body.classList.remove('bg-gray-468');
		document.body.classList.add('bg-gray-925');
	}, []);

	return (
		<>
			<AuthenticatorGuard>
				{children}
				<div className="flex flex-col fixed bottom-[20px] right-[20px] z-10">
					<UploadProgressWidget />
				</div>
			</AuthenticatorGuard>
		</>
	);
}
