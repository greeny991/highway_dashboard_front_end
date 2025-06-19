'use client';

import { MediaProvider } from '@/contexts/media.context';

export default function MediaLayout(props: any) {
	return (
		<main className="h-full w-full">
			<div className="h-full w-full">
				<MediaProvider>{props.children}</MediaProvider>
			</div>
		</main>
	);
}
