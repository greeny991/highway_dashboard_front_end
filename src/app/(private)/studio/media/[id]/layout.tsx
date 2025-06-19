'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IMedia } from '@/interfaces/media.interface';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { Loader } from '@/components/loader/loader.component';
import { useMedia } from '@/contexts/media.context';

export default function MediaLayout(props: any) {
	const router = useRouter();
	const { fetch } = useMedia();
	const [showError, setShowError] = useState(false);
	const [fetchInProgress, setFetchInProgress] = useState(true);

	useEffect(() => {
		setFetchInProgress(true);
		fetch(props.params.id)
			.then((data: IMedia) => {
				setFetchInProgress(false);
			})
			.catch(() => {
				setShowError(true);
				setFetchInProgress(false);
			});
	}, []);

	return (
		<>
			<ErrorModelWidget
				isOpen={showError}
				handleAction={() => router.push('/studio/media-catalogue', { scroll: false })}
				handleClose={() => router.push('/studio/media-catalogue', { scroll: false })}
				action="Try again later"
				description="Sorry, there was an error retrieving the video data."
			/>

			{fetchInProgress && (
				<div className="fixed w-full h-full top-0 left-0 right-0 z-50">
					<Loader />
				</div>
			)}

			{!fetchInProgress && !showError && (
				<main className="h-full w-full">
					<div className="h-full w-full">{props.children}</div>
				</main>
			)}
		</>
	);
}
