'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/loader/loader.component';
import { Icon } from '@/components/icon/icon.component';
import { formatCurrencyAmount } from '@/utils/format-currency-amount.util';
import { IRevenue } from '@/interfaces/revenue.interface';
import { useDla } from '@/contexts/dla.context';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { IPaginationResult } from '@/interfaces/pagination.interface';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { TableLoadMore } from '@/components/table-load-more.component';
import { RevenueListItem } from '@/components/revenue-list-item';

export default function BillingRevenuePage() {
	const router = useRouter();
	const { authenticator } = useAuthenticator();
	const { CompanyService } = useDla();
	const [revenue, setRevenue] = useState<IRevenue[]>([]);
	const [showError, setShowError] = useState(false);
	const [fetchInProgress, setFetchInProgress] = useState(false);
	const [continuationToken, setContinuationToken] = useState<string>();
	const [summaryRevenue, setSummaryRevenue] = useState<number>();

	function getData() {
		const companyId = authenticator.user.companyId as string;
		const now = new Date();
		const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
		const firstDayTimestamp = Math.floor(firstDayOfMonth.getTime() / 1000);
		const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
		const lastDayTimestamp = Math.floor(lastDayOfMonth.getTime() / 1000);

		setFetchInProgress(true);
		CompanyService.getRevenue({
			id: companyId,
			perPage: 25,
			continuationToken
		})
			.then((data: IPaginationResult<IRevenue>) => {
				setFetchInProgress(false);
				setRevenue([...revenue, ...data.items]);
				setContinuationToken(data.continuationToken);
			})
			.catch((error) => {
				setFetchInProgress(false);
				setShowError(true);
			});

		CompanyService.summaryRevenue({
			id: companyId,
			dateStart: firstDayTimestamp,
			dateEnd: lastDayTimestamp
		})
			.then((data: { revenue: number }) => {
				setSummaryRevenue(data.revenue);
			})
			.catch((error) => {});
	}

	useEffect(() => {
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

			{fetchInProgress && revenue.length === 0 && (
				<div className="w-full h-full">
					<Loader backdrop={false} />
				</div>
			)}

			{!fetchInProgress && revenue.length === 0 && (
				<div className="w-full h-full text-white-100 uppercase flex justify-center items-center px-[40px]">
					There is no revenue yet.
				</div>
			)}

			{revenue.length > 0 && (
				<div className="w-full flex flex-col pt-[84px]">
					<div className="flex items-center gap-4 w-full h font-primary font-medium text-[28px] text-white-100 px-6 py-4">
						<a className="w-full">BILLING & REVENUE</a>
						<div className="flex flex-row justify-end gap-4 w-full">
							<div className="flex px-6 py-4 border border-gray-725 rounded-[8px]">
								<Icon
									name="billing"
									className="rounded-[10px] mr-7 p-[8px] bg-green-900 fill-white-100 flex justify-center items-center"
									size="large"
								></Icon>
								<div className="flex flex-col text-center">
									{summaryRevenue !== undefined && (
										<div className="text-10">{formatCurrencyAmount(summaryRevenue, 'USD')}</div>
									)}
									{summaryRevenue === undefined && (
										<div className="relative text-10 w-[143px] h-[34px] scale-50 mb-2">
											<Loader backdrop={false} />
										</div>
									)}
									<div className="text-[10px]">TOTAL REVENUE THIS MONTH</div>
								</div>
							</div>
						</div>
					</div>
					<div className="w-full flex flex-col p-4 pt-0">
						<div className="pb-10 bg-gray-800 rounded-lg overflow-hidden">
							<table className="w-full">
								<thead className="font-primary font-normal text-[10px] uppercase text-white-100 opacity-60 whitespace-nowrap overflow-hidden text-ellipsis">
									<tr>
										<th className="text-start py-4 px-6">Media</th>
										<th className="text-start py-4 px-6">Media Name</th>
										<th className="text-start py-4 px-6">Product Id</th>
										<th className="text-start py-4 px-6">Quantity Sold</th>
										<th className="text-start py-4 px-6">Unit Price</th>
										<th className="text-start py-4 px-6">Total Revenue</th>
									</tr>
								</thead>
								<tbody className="font-primary font-normal text-[14px] text-white-100">
									<tr>
										<td colSpan={6} className="pt-4 px-6"></td>
									</tr>
									{revenue.map((item, index) => (
										<RevenueListItem data={item} key={index} />
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
				</div>
			)}
		</>
	);
}
