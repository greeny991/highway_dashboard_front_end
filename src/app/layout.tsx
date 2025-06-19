'use client';

import { useEffect } from 'react';
import { Providers } from '@/app/providers';
import { ToastContainer } from 'react-toastify';
import './globals.css';
import '@greenfishmedia/greenfish-player/dist/elv-player-js.css';
import 'react-toastify/dist/ReactToastify.css';

import { Roboto, Roboto_Flex } from 'next/font/google';

const roboto = Roboto({
	subsets: ['latin'],
	weight: ['100', '300', '400', '500', '700', '900'],
	variable: '--font-roboto'
});

const robotoFlex = Roboto_Flex({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'],
	variable: '--font-roboto-flex'
});

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	useEffect(() => {
		document.body.classList.remove('bg-gray-925');
		document.body.classList.add('bg-gray-468');
	}, []);

	return (
		<html lang="en" className={`h-full ${roboto.variable} ${robotoFlex.variable}`}>
			<head>
				<link rel="icon" href="/favicon.ico" />

				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
			</head>
			<body className="h-full w-full bg-gray-468">
				<Providers>{children}</Providers>
				<ToastContainer
					position="bottom-center"
					theme="dark"
					stacked
					progressClassName="toastify-progress-bar"
					bodyClassName="toastify-body"
				/>
			</body>
		</html>
	);
}
