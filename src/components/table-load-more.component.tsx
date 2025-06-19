'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from '@/components/loader/loader.component';

interface Props {
	continuationToken?: string;
	fetchInProgress: boolean;
	onEnterView: () => void;
}

export function TableLoadMore(props: Props) {
	const [showLoader, setShowLoader] = useState(false);
	const [inView, setInView] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		setShowLoader(props.fetchInProgress);
		if (!props.fetchInProgress && props.continuationToken && inView) {
			props.onEnterView();
		}
	}, [props.fetchInProgress, props.continuationToken, inView]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					setInView(entry.isIntersecting);
				});
			},
			{ threshold: 0.1 }
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			if (ref.current) {
				observer.unobserve(ref.current);
			}
		};
	}, []);

	return (
		<>
			<div ref={ref} className="w-full h-[1px]"></div>
			{showLoader && (
				<div className="relative w-full flex justify-center h-[100px] pt-[20px] scale-75">
					<Loader backdrop={false} />
				</div>
			)}
		</>
	);
}
