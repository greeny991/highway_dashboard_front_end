import { useEffect, useState } from 'react';
import { formatCurrencyAmount } from '@/utils/format-currency-amount.util';
import { IRevenue } from '@/interfaces/revenue.interface';

interface Props {
	data: IRevenue;
}

export function RevenueListItem(props: Props) {
	return (
		<>
			<>
				<tr>
					<td className="pt-4 pb-2 pl-6">
						<div className="pr-6 flex items-center">
							<div className="mr-6 relative overflow-hidden w-[102px] h-[70px] min-w-[102px]">
								<img
									src={props.data.publicationThumbnail}
									alt={props.data.publicationName}
									className="w-full h-full object-cover rounded-[8px]"
								/>
							</div>
						</div>
					</td>
					<td className="py-6 px-6">{props.data.publicationName}</td>
					<td className="py-6 px-6">{props.data.publicationId}</td>
					<td className="py-6 px-6">{props.data.quantity}</td>
					<td className="py-6 px-6">{formatCurrencyAmount(props.data.price, 'USD')}</td>
					<td className="py-6 px-6">{formatCurrencyAmount(props.data.revenue, 'USD')}</td>
				</tr>
				<tr>
					<td colSpan={6} className="px-6">
						<div className="w-full h-[1px] bg-white-20"></div>
					</td>
				</tr>
			</>
		</>
	);
}
