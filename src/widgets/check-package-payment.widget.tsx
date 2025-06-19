'use client';

import { useEffect, useState } from 'react';
import BaseModel from '@/components/base-model.component';
import { useDla } from '@/contexts/dla.context';
import { Loader } from '@/components/loader/loader.component';
import { Button } from '@/components/button/button.component';

interface Props {
	isOpen: boolean;
	handleClose: () => void;
}

export function CheckPackagePayment(props: Props) {
	const { PackageService } = useDla();
	const [showError, setShowError] = useState(false);
	const [fetchInProgress, setFetchInProgress] = useState(true);

	useEffect(() => {
		if (props.isOpen) {
			const params = new URLSearchParams(window.location.search);
			const sid = params.get('sid') as string;

			PackageService.checkCheckoutPayment(sid)
				.then(() => {
					props.handleClose();
				})
				.catch((error) => {
					setFetchInProgress(false);
					setShowError(true);
				});
		}
	}, [props.isOpen]);

	return (
		<>
			<BaseModel isOpen={props.isOpen} handleClose={props.handleClose}>
				<div className="relative w-[520px] h-fit max-w-[600px] flex flex-col items-center bg-gray-800 rounded-[8px] gap-6 p-12">
					{!showError && (
						<div className="font-primary text-[12px] font-light text-gray-200 uppercase w-full text-center">
							Please wait.
							<br />
							Validating your payment...
						</div>
					)}

					{showError && (
						<div className="font-primary text-[12px] font-light text-gray-200 uppercase w-full text-center leading-5">
							<span className="text-red-200">Error validating your payment</span>
							<br />
							Please contact administration if your purchase
							<br />
							is not completed.
						</div>
					)}

					<div className="w-full relative">
						{fetchInProgress && (
							<div className="relative w-full h-[100px]">
								<Loader backdrop={false} />
							</div>
						)}
						{showError && (
							<div className="w-[full] flex flex-col pt-[15px]">
								<Button type="primary" fluid onClick={() => props.handleClose()}>
									Close
								</Button>
							</div>
						)}
					</div>
				</div>
			</BaseModel>
		</>
	);
}
