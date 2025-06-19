'use client';

import { NavBarStudioWidget } from '@/widgets/nav-bar-studio.widget';

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="h-full w-full">
			<div className="fixed top-0 left-0 right-0 z-10">
				<NavBarStudioWidget />
			</div>
			<div className="h-full w-full">{children}</div>
		</main>
	);
}
