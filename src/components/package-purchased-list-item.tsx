import { useEffect, useState } from 'react';
import { IPackagePurchase } from '@/interfaces/package-purchase.interface';
import { formatCurrencyAmount } from '@/utils/format-currency-amount.util';
import { TimestampToDatetime } from '@/utils/timestamp-to-datetime.util';
import { Button } from '@/components/button/button.component';

interface Props {
	data: IPackagePurchase;
}

export function PackagePurchasedListItem(props: Props) {
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		const currentTimestamp = Math.floor(Date.now() / 1000);
		const isActive =
			currentTimestamp >= props.data.dateStart && currentTimestamp <= props.data.dateEnd;
		setIsActive(isActive);
	}, []);

	return (
		<>
			<tr>
				<td className="py-6 px-6">{props.data.package.name}</td>
				<td className="py-6 px-6">{props.data.package.description}</td>
				<td className="py-6 pl-6">{TimestampToDatetime(props.data.dateStart)}</td>
				<td className="py-6 pl-6">{TimestampToDatetime(props.data.dateEnd)}</td>
				<td className="py-6 px-6">{props.data.package.paymentType}</td>
				<td className="py-6 px-6">
					{formatCurrencyAmount(props.data.package.price, 'USD') + ' / month'}
				</td>
				<td className="py-6 px-6 w-[150px]">
					<div className="w-full flex justify-end">
						{isActive && (
							<Button textColor="text-gray-462" className="!h-10  !w-auto" fluid onClick={() => {}}>
								Cancel
							</Button>
						)}
					</div>
				</td>
			</tr>
			<tr>
				<td colSpan={7} className="px-6">
					<div className="w-full h-[1px] bg-white-20"></div>
				</td>
			</tr>
		</>
	);
}
