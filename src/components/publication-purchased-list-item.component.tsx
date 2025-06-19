import { IPublicationPurchase } from '@/interfaces/publication-purchase.interface';
import { formatCurrencyAmount } from '@/utils/format-currency-amount.util';
import { TimestampToDatetime } from '@/utils/timestamp-to-datetime.util';

interface Props {
	data: IPublicationPurchase;
}
export function PublicationPurchasedListItem(props: Props) {
	return (
		<>
			<tr>
				<td className="pt-4 pb-2 pl-6">
					<div className="pr-6 flex items-center">
						<div className="mr-6 relative overflow-hidden w-[102px] h-[70px] min-w-[102px]">
							<img
								src={
									process.env.NEXT_PUBLIC_CONTENT_FABRIC_BASE_URL_STATICS +
									props.data.publicationThumbnail
								}
								className="w-full h-full object-cover rounded-[8px]"
							/>
						</div>
						<div>{props.data.publicationName}</div>
					</div>
				</td>
				<td className="pt-4 pb-3 px-6">{props.data.publicationId}</td>
				<td className="pt-4 pb-3 px-6">{TimestampToDatetime(props.data.createdAt)}</td>
				<td className="pt-4 pb-3 px-6">{formatCurrencyAmount(props.data.price, 'USD')}</td>
			</tr>
			<tr>
				<td colSpan={4} className="px-6">
					<div className="w-full h-[1px] bg-white-20"></div>
				</td>
			</tr>
		</>
	);
}
