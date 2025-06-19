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
			className={`group ${props.danger ? 'text-red-200 hover:text-red-200' : 'text-gray-200 '}
    block w-full h-[38px] px-[16px] py-2 cursor-pointer font-light text-[12px] rounded-[8px] font-primary truncate hover:bg-white-100 hover:bg-opacity-20 transition-all duration-100`}
		>
			<div
				className={`${props.danger ? 'fill-red-200 hover:fill-red-200' : 'fill-gray-200 group-hover:fill-white-100 group-hover:text-white-100'}
        h-full flex flex-row items-center justify-start `}
			>
				{props.asset && <Icon name={props.asset} size="small" className="pr-3"></Icon>} {props.name}
			</div>
		</li>
	);
}
