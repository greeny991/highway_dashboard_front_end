'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/loader/loader.component';
import { useDla } from '@/contexts/dla.context';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { IPaginationResult } from '@/interfaces/pagination.interface';
import { TableLoadMore } from '@/components/table-load-more.component';
import { IPublicationPurchase } from '@/interfaces/publication-purchase.interface';
import { PublicationPurchasedListItem } from '@/components/publication-purchased-list-item.component';

export default function MediaPurchasesPage() {
	const router = useRouter();
	const { authenticator } = useAuthenticator();
	const { UserService } = useDla();
	const [purchases, setPurchases] = useState<IPublicationPurchase[]>([]);
	const [showError, setShowError] = useState(false);
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [continuationToken, setContinuationToken] = useState<string>();

	function getData() {
		const userId = authenticator.user.id as string;

		setFetchInProgress(true);
		UserService.getPublicationsPurchases({
			id: userId,
			perPage: 25,
			continuationToken
		})
			.then((data: IPaginationResult<IPublicationPurchase>) => {
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
		getData();
	}, []);

	return (
		<>
			<ErrorModelWidget
				isOpen={showError}
				handleAction={() => router.push('/', { scroll: false })}
				handleClose={() => router.push('/', { scroll: false })}
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
					You have not purchased any media yet. Begin by purchasing media from the
					<a
						className="cursor-pointer text-blue-250 underline pl-[8px]"
						onClick={() => router.push('/', { scroll: false })}
					>
						&quot;Media Catalogue&quot;.
					</a>
				</div>
			)}

			{purchases.length > 0 && (
				<div className="w-full">
					<div className="font-primary font-medium text-[28px] text-white-100 px-6 py-[24px]">
						<a>MEDIA PURCHASES</a>
					</div>
					<div className="w-full flex flex-col p-4 pt-0">
						<div className="pb-10 bg-gray-950 rounded-lg overflow-hidden">
							<table className="w-full">
								<thead className="font-primary font-normal text-[10px] uppercase text-white-100 opacity-60 whitespace-nowrap overflow-hidden text-ellipsis">
									<tr>
										<th className="text-start py-4 px-6">Media</th>
										<th className="text-start py-4 px-6">Product Id</th>
										<th className="text-start py-4 px-6">Date Purchased</th>
										<th className="text-start py-4 px-6">Unit Price</th>
									</tr>
								</thead>
								<tbody className="font-primary font-normal text-[14px] text-white-100">
									<tr>
										<td colSpan={4} className="pt-4 px-6"></td>
									</tr>
									{purchases.map((item, index) => (
										<PublicationPurchasedListItem data={item} key={index} />
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
