'use client';

import { Icon } from '@/components/icon/icon.component';

interface Props {
	title: string;
	scr: string;
	value: string;
	change: string;
}

export function AnalyticsItem(props: Props) {
	return (
		<div className="group h-[248px] w-full">
			<div className="flex flex-col h-full justify-between bg-gray-800 group-hover:bg-gray-225 p-6 rounded-[8px]">
				<div className="flex gap-2 items-center">
					<Icon
						name={props.scr}
						size="medium"
						className="p-3 bg-gray-925 fill-white-100 group-hover:fill-gray-225 rounded-[8px]"
					></Icon>
					<label className="block m-2 text-[12px] text-white-100 group-hover:text-gray-775 font-normal uppercase overflow-hidden">
						<span className="line-clamp-2">{props.title}</span>
					</label>
				</div>
				<div className="pt-2">
					<label className="block m-2 text-[48px] text-white-100 group-hover:text-gray-775 font-normal uppercase overflow-hidden">
						<span className="line-clamp-2">{props.value}</span>
					</label>
				</div>
				<div className="flex gap-2 items-center">
					<div className="flex px-1 items-center border border-green-200 group-hover:border-gray-775 rounded-full">
						<Icon
							name="chevron-up"
							size="small"
							className="pl-1 fill-green-200 group-hover:fill-gray-775"
						></Icon>
						<label className="block m-2 text-[14px] text-green-200  group-hover:text-gray-775 font-normal uppercase overflow-hidden">
							<span className="line-clamp-2">{props.change}</span>
						</label>
					</div>
					<label className="block m-2 pr-4 text-[8px] text-white-100 group-hover:text-gray-775 font-extralight uppercase overflow-hidden">
						<span className="line-clamp-2">Change from previous month</span>
					</label>
				</div>
			</div>
		</div>
	);
}
