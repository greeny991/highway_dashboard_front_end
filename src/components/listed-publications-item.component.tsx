'use client';

import { Icon } from '@/components/icon/icon.component';
import { TitleValueItem } from './title-value-item.component';

interface Props {
	scr: string;
	title: string;
	value: string;
}

export function ListedPublicationsItem(props: Props) {
	return (
		<div className="w-full h-fit">
			<div className="flex flex-row h-full justify-between bg-gray-800 p-3 rounded-[8px]">
				<div className={`relative w-[121px] min-w-[121px] h-[73px] rounded-[8px]`}>
					<img src="/images/default.png" className="w-full h-full object-cover rounded-[8px]" />
				</div>
				<div className="flex flex-col w-full pl-2 gap-2">
					<div className="flex flex-row justify-between">
						<TitleValueItem title="Display Name" value="Media Name" />
						<label className="block text-[10px] text-white-100 font-normal uppercase overflow-hidden">
							ID # 12345
						</label>
					</div>
					<div className="flex flex-row justify-between items-center">
						<TitleValueItem title="Published Date" value="09.29.2021" />
						<TitleValueItem title="Destination" value="Destination" />
						<TitleValueItem title="Total Views" value="1,234" />
						<TitleValueItem title="30D Views" value="4,321" />
						<Icon name="chevron-right" color="fill-white-100" size="smedium" />
					</div>
				</div>
			</div>
		</div>
	);
}
