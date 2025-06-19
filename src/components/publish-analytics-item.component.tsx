'use client';

import { Icon } from '@/components/icon/icon.component';

interface Props {
	title: string;
	scr: string;
	value: string;
	change: string;
	colorTheme: 'primary' | 'secondary';
}

export function PublishAnalyticsItem(props: Props) {
	const bgColor = props.colorTheme === 'primary' ? 'bg-gray-800' : 'bg-green-900';
	const iconColor = props.colorTheme === 'primary' ? 'fill-white-100' : 'fill-green-200';
	const chevronIconColor = props.colorTheme === 'primary' ? 'fill-green-550' : 'fill-green-200';
	const textColor = props.colorTheme === 'primary' ? 'text-green-550' : 'text-green-200';
	const borderColor = props.colorTheme === 'primary' ? 'border-green-550' : 'border-green-200';

	return (
		<div className="group w-full">
			<div
				className={`flex h-full justify-between ${bgColor} group-hover:bg-gray-225 p-4 rounded-[8px]`}
			>
				<div className="flex gap-2 items-center">
					<Icon
						name={props.scr}
						size="medium"
						className={`p-3 bg-gray-925 ${iconColor} group-hover:fill-gray-225 rounded-[8px]`}
					></Icon>
					<label className="block m-2 text-[16px] text-white-100 group-hover:text-gray-775 font-normal overflow-hidden">
						<span className="line-clamp-2">{props.title}</span>
					</label>
				</div>
				<div className="flex gap-2 items-center">
					<label className="block m-2 text-[20px] text-white-100 group-hover:text-gray-775 font-normal uppercase overflow-hidden">
						<span className="line-clamp-2">{props.value}</span>
					</label>
					<div
						className={`flex px-1 items-center border ${borderColor} group-hover:border-gray-775 rounded-full`}
					>
						<Icon
							name="chevron-up"
							size="small"
							className={`pl-1 ${chevronIconColor} group-hover:fill-gray-775`}
						></Icon>
						<label
							className={`block m-2 text-[14px] ${textColor} group-hover:text-gray-775 font-normal uppercase overflow-hidden`}
						>
							<span className="line-clamp-2">{props.change}%</span>
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}
