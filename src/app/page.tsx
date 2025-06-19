'use client';

import { Slider } from '@/components/slider/slider.component';
import { HomePageWidget } from '@/widgets/home-page.widget';
import { useEffect, useState } from 'react';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';

import { useRouter } from 'next/navigation';
import { Loader } from '@/components/loader/loader.component';

export default function HomePage() {
	const router = useRouter();
	const { authenticator } = useAuthenticator();
	const [showPage, setShowPage] = useState(false);
	const [isRedirecting, setIsRedirecting] = useState(false); // State to track redirection

	useEffect(() => {
		if (authenticator.user) {
			router.push('/studio/media-catalogue', { scroll: false });
			setShowPage(false);
		} else {
			router.push('/studio/signin', { scroll: false });
			setShowPage(false);
			// setShowPage(true);
		}
	}, [authenticator.user, isRedirecting, router]);
	return (
		<>
			{/* Show Loader when redirecting */}
			{isRedirecting && (
				<main className="relative h-full flex items-center justify-center">
					<Loader backdrop={false} />
				</main>
			)}
			{!isRedirecting && showPage && (
				<main className="flex h-full min-h-[768px]">
					<div className="w-1/2 h-full p-[4px] sm:p-[12px] md:p-[24px]">
						<Slider
							images={['/images/17.png', '/images/19.png', '/images/201.png', '/images/181.png']}
							title="Finally content you can control"
							subtitle="Lorem ipsum dolor sit amet"
						/>
					</div>
					<div className="relative w-1/2 h-full p-[24px] flex items-center justify-center">
						<HomePageWidget setIsRedirecting={setIsRedirecting} />
					</div>
				</main>
			)}
		</>
	);
}
