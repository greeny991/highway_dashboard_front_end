'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { Loader } from '@/components/loader/loader.component';
import { NavBarCompletedPublishWidget } from '@/widgets/nav-bar-completed-publish.widget';
import { usePublication } from '@/contexts/publication.context';
import { IPublication } from '@/interfaces/publication.interface';

export default function PublicationDetailLayout(props: any) {
	const router = useRouter();
	const { fetch, publication } = usePublication();
	const [showError, setShowError] = useState(false);
	const [fetchInProgress, setFetchInProgress] = useState(true);

	useEffect(() => {
		setFetchInProgress(true);
		fetch(props.params.id)
			.then((data: IPublication) => {
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
				description="Sorry, there was an error retrieving the publication data."
			/>

			{fetchInProgress && (
				<div className="fixed w-full h-full top-0 left-0 right-0 z-50">
					<Loader />
				</div>
			)}

			{!fetchInProgress && !showError && (
				<main className="h-full w-full">
					<div className="fixed top-0 left-0 right-0 z-10">
						<NavBarCompletedPublishWidget publication={publication} />
					</div>
					<div className="h-full w-full">{props.children}</div>
				</main>
			)}
		</>
	);
}
