'use client';

import { PublicationProvider } from '@/contexts/publication.context';

export default function PublicationLayout(props: any) {
	return (
		<main className="h-full w-full">
			<div className="h-full w-full">
				<PublicationProvider>{props.children}</PublicationProvider>
			</div>
		</main>
	);
}
