'use client';

import { useEffect } from 'react';

export default function PrivateLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	useEffect(() => {
		document.body.classList.remove('bg-gray-468');
		document.body.classList.add('bg-gray-925');
	}, []);

	return <>{children}</>;
}
