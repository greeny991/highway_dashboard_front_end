'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { SelectPackage } from '@/components/select-package.component';
import { BoxWidget } from '@/widgets/box.widget';
import { useDla } from '@/contexts/dla.context';
import { IPackage } from '@/interfaces/package.interface';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { Loader } from '@/components/loader/loader.component';
import { InlineLoader } from '@/components/inline-loader/inline-loader.component';

interface Props {
	cancel?: boolean;
}

export function CompanyPackageWidget(props: Props) {
	const router = useRouter();
	const { PackageService } = useDla();
	const [starterPackage, setStarterPackage] = useState(true);
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
				setShowError(true);
			});
	}, []);

	function createCheckoutLink(packageId: string) {
		setCheckoutInProgress(true);
		PackageService.createCheckoutLink({
			packageId: packageId,
			successUrl: `${process.env.NEXT_PUBLIC_BASE_APP_URL}/studio/signup/package/success?sid={CHECKOUT_SESSION_ID}`,
			cancelUrl: `${process.env.NEXT_PUBLIC_BASE_APP_URL}/studio/signup/package/cancel`
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
					handleAction={() => router.push('/studio', { scroll: false })}
					handleClose={() => router.push('/studio', { scroll: false })}
					action="Try again later"
					description="Sorry, there was an error creating your account."
				/>
			)}

			{fetchInProgress && (
				<div className="relative w-full h-full">
					<Loader backdrop={false} />
				</div>
			)}

			{!fetchInProgress && starterPackage && (
				<BoxWidget title="your starter package">
					<div className="font-primary text-[12px] font-light text-gray-200 uppercase">
						No contracts. No surprise fees.
					</div>
					{packages
						.filter((pack) => !pack.addon)
						.map((pack, index) => (
							<div className="w-full h-full" key={index}>
								<div className="p-2" />
								<div className="flex flex-col px-16 py-8 gap-4 border border-gray-460 rounded-[8px]">
									<div className="flex items-end gap-2">
										<div className="font-primary text-[40px] leading-[40px] text-green-200 font-medium uppercase">
											${pack.price}
										</div>
										<div className="font-primary text-[24px] leading-[28.13px] text-white-100 font-normal">
											/ month
										</div>
									</div>
									<div className="flex flex-col font-primary text-[12px] leading-[24px] text-white-100 font-normal uppercase">
										<div className="opacity-60">Storage</div>
										<div className="flex items-center gap-[10px]">
											<Icon name="tick-round" />
											{pack.storageInGb} GB Storage
										</div>
										<div className="flex items-center gap-[10px]">
											<Icon name="tick-round" />
											{pack.streamsInHours} Hrs Streams
										</div>
									</div>
									<div className="flex flex-col font-primary text-[12px] leading-[24px] text-white-100 font-normal uppercase">
										<div className="opacity-60">Storage</div>
										<div className="flex items-center gap-[10px]">
											<Icon name="tick-round" />
											{pack.account?.admin} Admin
										</div>
										<div className="flex items-center gap-[10px]">
											<Icon name="tick-round" />
											{pack.account?.teamMembers} Team Members
										</div>
									</div>
									{!checkoutInProgress && (
										<Button type="primary" fluid onClick={() => createCheckoutLink(pack.id)}>
											Continue to checkout
										</Button>
									)}
									{checkoutInProgress && (
										<Button type="primary" fluid disabled={true}>
											<InlineLoader size="small" />
										</Button>
									)}
								</div>
							</div>
						))}
					<div className="p-3" />
					<div className="text-[10px] font-light text-white-100 uppercase">want more capacity?</div>
					<Button
						type="text"
						onClick={() => {
							setStarterPackage(false);
						}}
					>
						check our add-ons
					</Button>
					{props.cancel && (
						<>
							<div className="p-3" />
							<div className="text-[12px] text-red-200 flex">
								To proceed with the registry, please subscribe to the Starter Package.
							</div>
						</>
					)}
				</BoxWidget>
			)}

			{!fetchInProgress && !starterPackage && (
				<BoxWidget title="Add-ons">
					<div className="font-primary text-[12px] font-light text-gray-200 uppercase">
						Starter package is required to purchase add-ons
					</div>
					<div className="p-2" />
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
										selected={pack.id}
										readonly={true}
										onChange={(value: string) => {}}
									/>
								</div>
							))}
					</div>
					<div className="p-4" />
					<Button
						type="secondary"
						fluid
						onClick={() => {
							setStarterPackage(true);
						}}
					>
						<Icon name="chevron-left" className="pr-2" size="ten" />
						Back to Starter Package
					</Button>
				</BoxWidget>
			)}
		</>
	);
}
