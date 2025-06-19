'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import BaseModel from '@/components/base-model.component';
import { useEffect, useState } from 'react';
import { Avatar } from '@/components/avatar.component';
import { SelectPackage } from '@/components/select-package.component';
import { useDla } from '@/contexts/dla.context';
import { IPackage } from '@/interfaces/package.interface';
import { Loader } from '@/components/loader/loader.component';
import { formatCurrencyAmount } from '@/utils/format-currency-amount.util';
import { ErrorModelWidget } from '@/widgets/error.widget';

interface Props {
	isOpen: boolean;
	handleClose: () => void;
	successUrl: string;
	cancelUrl: string;
}

export function AddonCheckoutWidget(props: Props) {
	const { PackageService } = useDla();
	const [selectedPackage, setSelectedPackage] = useState<IPackage>({} as IPackage);
	const [showDetails, setShowDetails] = useState(false);
	const [showError, setShowError] = useState(false);
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [checkoutInProgress, setCheckoutInProgress] = useState(false);
	const [packages, setPackages] = useState<IPackage[]>([]);

	useEffect(() => {
		PackageService.getAll()
			.then((data: IPackage[]) => {
				setFetchInProgress(false);
				setPackages(data);
			})
			.catch((error) => {
				setFetchInProgress(false);
			});
	}, []);

	function createCheckoutLink(packageId: string) {
		setCheckoutInProgress(true);
		PackageService.createCheckoutLink({
			packageId: packageId,
			successUrl: props.successUrl,
			cancelUrl: props.cancelUrl
		})
			.then((data: { url: string }) => {
				window.open(data.url, '_self');
			})
			.catch((error) => {
				setCheckoutInProgress(false);
				setShowError(true);
			});
	}

	return (
		<>
			{showError && (
				<ErrorModelWidget
					isOpen={showError}
					handleAction={() => setShowError(false)}
					handleClose={() => setShowError(false)}
					action="Try again later"
					description="Sorry, there was an error when purchasing the package."
				/>
			)}

			<BaseModel isOpen={props.isOpen} handleClose={props.handleClose}>
				<div className="relative w-[520px] h-fit max-w-[600px] flex flex-col items-center bg-gray-800 rounded-[8px] gap-6">
					{checkoutInProgress && (
						<div className="absolute w-full h-full z-40">
							<Loader />
						</div>
					)}

					{showDetails && (
						<div className="relative w-full flex flex-col p-12">
							<div className="relative flex flex-col w-full items-center">
								<Icon
									name="close"
									size="medium"
									className="absolute top-0 right-0 p-[4px] fill-gray-200 hover:fill-green-200 hover:cursor-pointer"
									onClick={() => {
										setShowDetails(false);
										props.handleClose();
									}}
								/>
								<Avatar />
								<div className="p-6" />
								<p className="font-primary font-normal text-[22px] text-white-100 uppercase text-center">
									complete your purchase
								</p>
								<hr className="w-full h-px my-6 bg-white-10 border-0 rounded" />
							</div>
							<div className="w-full flex flex-col gap-6">
								<div className="font-primary text-[16px] leading-[18.75px] text-gray-150 font-medium">
									Pay HIWAY, LLC
								</div>
								<div className="font-primary text-[32px] leading-[37.5px] text-green-200 font-normal uppercase">
									{formatCurrencyAmount(selectedPackage.price, 'USD')}
								</div>
								<div className="flex flex-col gap-2">
									<div className="flex justify-between">
										<div className="font-primary text-[16px] leading-[18.75px] text-white-100 font-medium uppercase">
											+
											{selectedPackage.streamsInHours
												? `+${selectedPackage.streamsInHours} stream hours`
												: `+${selectedPackage.storageInGb} GB storage space`}{' '}
											- MONTHLY
										</div>
										<div className="font-primary text-[16px] leading-[18.75px] text-white-100 font-medium uppercase">
											{formatCurrencyAmount(selectedPackage.price, 'USD')}
										</div>
									</div>
									<div className="flex justify-between">
										<div className="font-primary text-[16px] leading-[18.75px] text-gray-462 font-normal">
											Qty 1
										</div>
										<div className="font-primary text-[16px] leading-[18.75px] text-gray-462 font-normal uppercase">
											{formatCurrencyAmount(selectedPackage.price, 'USD')}
										</div>
									</div>
								</div>
								<Button type="primary" fluid onClick={() => createCheckoutLink(selectedPackage.id)}>
									Checkout
								</Button>
							</div>
						</div>
					)}

					{!showDetails && (
						<div className="w-full flex flex-col gap-6 p-12">
							<div className="flex flex-row justify-between w-full items-center">
								<div className={`flex flex-row items-center`}>
									<Icon
										name="package"
										className="mr-[8px] p-[8px] bg-green-200  rounded-full fill-gray-925"
										size="medium"
									/>
									<label className="block m-2 font-primary   text-[16px] text-white-100 font-normal uppercase overflow-hidden">
										<span className="line-clamp-2">Select an Add-on</span>
									</label>
								</div>
								<Icon
									name="close"
									size="medium"
									className="p-[4px] fill-gray-200 hover:fill-green-200 hover:cursor-pointer"
									onClick={props.handleClose}
								/>
							</div>

							{fetchInProgress && (
								<div className="relative w-full h-[200px]">
									<Loader backdrop={false} />
								</div>
							)}

							{!fetchInProgress && (
								<>
									<div className="w-full flex flex-col gap-4">
										{packages
											.filter((pack) => pack.addon)
											.map((pack, index) => (
												<div className="w-full" key={index}>
													<SelectPackage
														name={pack.name}
														description={
															pack.streamsInHours
																? `+${pack.streamsInHours} hours`
																: `+${pack.storageInGb} GB`
														}
														price={`$${pack.price} / month`}
														value={pack.id}
														selected={selectedPackage.id}
														onChange={(value: string) => {
															const selectedPackage = packages.find((p) => p.id === value);
															setSelectedPackage(selectedPackage as IPackage);
														}}
													/>
												</div>
											))}
									</div>
									<div className="w-full flex flex-col gap-4">
										<Button
											type="primary"
											fluid
											onClick={() => setShowDetails(true)}
											disabled={selectedPackage.id ? false : true}
										>
											Continue
										</Button>
										<Button type="secondary" fluid onClick={props.handleClose}>
											Cancel
										</Button>
									</div>
								</>
							)}
						</div>
					)}
				</div>
			</BaseModel>
		</>
	);
}
