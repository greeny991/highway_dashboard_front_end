'use client';

import { Toggle } from './toggle.component';

interface Props {
	title: string;
	subtitle?: string;
	isOn: boolean;
	className?: string;
	onClick?: () => void;
}

export function ToggleSelectionItem(props: Props) {
	return (
		<div className={`flex flex-row items-center justify-between ${props.className}`}>
			<div className="pr-[20px]">
				<p className="font-primary font-normal text-[14px] text-white-100">{props.title}</p>
				{props.subtitle && (
					<p className="font-primary font-normal text-[10px] text-gray-300 uppercase ">
						{props.subtitle}
					</p>
				)}
			</div>
			<Toggle value={props.isOn} onChange={props.onClick} />
		</div>
	);
}
