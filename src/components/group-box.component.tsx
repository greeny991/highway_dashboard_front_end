'use client';

import { Icon } from './icon/icon.component';

interface Props {
	title: string;
	iconName: string;
	children?: any;
}

export function GroupBox(props: Props) {
	return (
		<div className="flex flex-col justify-between w-full p-6 rounded-lg gap-6 bg-gray-468">
			<div className="flex flex-col gap-2">
				<div className={`flex flex-row items-center`}>
					<Icon
						name={props.iconName}
						className="mr-[8px] p-[8px] bg-green-200 bg-opacity-15 rounded-full fill-green-200 hover:fill-green-200"
						size="small"
					/>
					<label className="block m-2 font-primary text-[16px] text-white-100 font-medium uppercase overflow-hidden">
						<span className="line-clamp-2">{props.title}</span>
					</label>
				</div>
				<hr className="w-full h-px bg-white-10 border-0 rounded" />
			</div>
			{props.children}
		</div>
	);
}
