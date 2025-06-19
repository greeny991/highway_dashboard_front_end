'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/loader/loader.component';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { IPackagePurchase } from '@/interfaces/package-purchase.interface';
import { useDla } from '@/contexts/dla.context';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { PackagePurchasedListItem } from '@/components/package-purchased-list-item';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { IPaginationResult } from '@/interfaces/pagination.interface';
import { AddonCheckoutWidget } from '@/widgets/addon-checkout.widget';
import { CheckPackagePayment } from '@/widgets/check-package-payment.widget';
import { TableLoadMore } from '@/components/table-load-more.component';

export default function PackagePurchasesPage() {
	const router = useRouter();
	const { authenticator } = useAuthenticator();
	const { CompanyService } = useDla();
	const [purchases, setPurchases] = useState<IPackagePurchase[]>([]);
	const [showError, setShowError] = useState(false);
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [addOnModal, setAddonModal] = useState(false);
	const [showPackagePaymentModal, setShowPackagePaymentModal] = useState(false);
	const [continuationToken, setContinuationToken] = useState<string>();

	function getData() {
		const companyId = authenticator.user.companyId as string;

		setFetchInProgress(true);
		CompanyService.getPackagesPurchases({
			id: companyId,
			perPage: 25,
			continuationToken
		})
			.then((data: IPaginationResult<IPackagePurchase>) => {
				setFetchInProgress(false);
				setPurchases([...purchases, ...data.items]);
				setContinuationToken(data.continuationToken);
			})
			.catch((error) => {
				setFetchInProgress(false);
				setShowError(true);
			});
	}

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const sid = params.get('sid') as string;
		setShowPackagePaymentModal(!!sid);
		getData();
	}, []);

	return (
		<>
			<ErrorModelWidget
				isOpen={showError}
				handleAction={() => router.push('/studio/media-catalogue', { scroll: false })}
				handleClose={() => router.push('/studio/media-catalogue', { scroll: false })}
				action="Try again later"
				description="Sorry, there was an unexpected error."
			/>

			{fetchInProgress && purchases.length === 0 && (
				<div className="w-full h-full">
					<Loader backdrop={false} />
				</div>
			)}

			{!fetchInProgress && purchases.length === 0 && (
				<div className="w-full h-full text-white-100 uppercase flex justify-center items-center px-[40px]">
					You have not purchases any package yet. Begin by selecting a package from
					<a
						className="cursor-pointer text-blue-250 underline pl-[8px]"
						onClick={() => router.push('/studio/media-catalogue', { scroll: false })}
					>
						&quot;Manage Packages&quot;.
					</a>
				</div>
			)}

			{purchases.length > 0 && (
				<div className="w-full flex flex-col pt-[84px]">
					<div className="flex gap-4 w-full font-primary font-medium text-[28px] text-white-100 px-6 py-12">
						<a className="w-full">PACKAGE PURCHASES</a>
						<div className="flex flex-row justify-end gap-4 w-full">
							<Button
								type="primary"
								bgColor="bg-green-600"
								textColor="text-white-100"
								onClick={() => setAddonModal(true)}
							>
								Purchase Packages
							</Button>
							<Button
								type="default"
								iconColorType="primary-dark"
								bgColor="bg-gray-380"
								textColor="text-white-100"
							>
								<Icon name="download-file" size="small" />
								<label className="px-2">Download CSV</label>
							</Button>
						</div>
					</div>
					<div className="w-full flex flex-col p-4 pt-0">
						<div className="pb-10 bg-gray-800 rounded-lg overflow-hidden">
							<table className="w-full">
								<thead className="font-primary font-normal text-[10px] uppercase text-white-100 opacity-60 whitespace-nowrap overflow-hidden text-ellipsis">
									<tr>
										<th className="text-start py-4 px-6">Package</th>
										<th className="text-start py-4 px-6">Package Description</th>
										<th className="text-start py-4 px-6">Start Date</th>
										<th className="text-start py-4 px-6">End Date</th>
										<th className="text-start py-4 px-6">Payment Type</th>
										<th className="text-start py-4 px-6">Price</th>
										<th className="text-start py-4 px-6"></th>
									</tr>
								</thead>
								<tbody className="font-primary font-normal text-[14px] text-white-100">
									<tr>
										<td colSpan={5} className="pt-4 px-6"></td>
									</tr>
									{purchases.map((item, index) => (
										<PackagePurchasedListItem data={item} key={index} />
									))}
								</tbody>
							</table>
							<TableLoadMore
								fetchInProgress={fetchInProgress}
								continuationToken={continuationToken}
								onEnterView={getData}
							/>
						</div>
					</div>

					<AddonCheckoutWidget
						isOpen={addOnModal}
						handleClose={() => setAddonModal(false)}
						successUrl={`${process.env.NEXT_PUBLIC_BASE_APP_URL}/studio/package-purchases?sid={CHECKOUT_SESSION_ID}`}
						cancelUrl={`${process.env.NEXT_PUBLIC_BASE_APP_URL}/studio/package-purchases`}
					/>

					<CheckPackagePayment
						isOpen={showPackagePaymentModal}
						handleClose={() => setShowPackagePaymentModal(false)}
					/>
				</div>
			)}
		</>
	);
}
