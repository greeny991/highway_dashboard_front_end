'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BoxWidget } from '@/widgets/box.widget';
import { useDla } from '@/contexts/dla.context';
import { Loader } from '@/components/loader/loader.component';
import { Button } from '@/components/button/button.component';

export default function CompanyPackageSuccessPage() {
	const router = useRouter();
	const { PackageService } = useDla();
	const [showError, setShowError] = useState(false);
	const [fetchInProgress, setFetchInProgress] = useState(true);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const sid = params.get('sid') as string;

		PackageService.checkCheckoutPayment(sid)
			.then(() => {
				router.push('/studio/signup/stripe', { scroll: false });
			})
			.catch(() => {
				setFetchInProgress(false);
				setShowError(true);
			});
	}, []);

	return (
		<>
			<BoxWidget title="PAYMENT VALIDATION">
				{!showError && (
					<div className="font-primary text-[12px] font-light text-gray-200 uppercase w-full text-center">
						Please wait.
						<br />
						Validating your payment...
					</div>
				)}

				{showError && (
					<>
						<div className="p-3" />
						<div className="font-primary text-[12px] font-light text-gray-200 uppercase w-full text-center leading-5">
							<span className="text-red-200">Error validating your payment</span>
							<br />
							To proceed with the registry, please subscribe
							<br />
							to the Starter Package.
						</div>
					</>
				)}

				<div className="p-2" />
				<div className="w-full h-[100px] relative">
					{fetchInProgress && <Loader backdrop={false} />}
					{showError && (
						<div className="w-[full] flex flex-col">
							<div className="p-3" />
							<Button
								type="primary"
								fluid
								onClick={() => router.push('/studio/signup/package', { scroll: false })}
							>
								Try again
							</Button>
						</div>
					)}
				</div>
			</BoxWidget>
		</>
	);
}
