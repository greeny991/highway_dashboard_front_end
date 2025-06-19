'use client';

import { Icon } from '@/components/icon/icon.component';

interface Props {
	name: string;
	asset?: string;
	danger?: boolean;
}

export function DropdownItem(props: Props) {
	return (
		<li
			className={`${props.danger ? 'text-red-200 hover:text-red-200' : 'text-white-80 hover:text-white-100'}
    block w-full h-[38px] px-[16px] py-2 cursor-pointer font-normal text-[15px] rounded-[8px] font-primary truncate transition-all duration-100`}
		>
			<div
				className={`${props.danger ? 'fill-red-200 hover:fill-red-200' : 'fill-white-80 hover:fill-white-100'}
        h-full flex flex-row items-center justify-start `}
			>
				{props.asset && <Icon name={props.asset} size="small" className="pr-2"></Icon>} {props.name}
			</div>
		</li>
	);
}
