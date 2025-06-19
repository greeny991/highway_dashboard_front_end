'use client';

export default function MediaPurchasesLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="h-full w-full">
			<div className="h-full w-full">{children}</div>
		</main>
	);
}
