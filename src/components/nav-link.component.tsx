'use client';

import { Icon } from '@/components/icon/icon.component';

interface Props {
	title: string;
	selected?: boolean;
	truncate?: string;
	click?: () => void;
}

export function NavLink(props: Props) {
	return (
		<div className="group" onClick={props.click}>
			<a
				className={`${props.selected && 'text-white-100'}
        flex items-center gap-2 no-underline text-gray-200 group-hover:text-white-100 fill-gray-200 group-hover:fill-white-100 text-[16px] cursor-pointer`}
			>
				<span className={`${props.truncate && props.truncate + ' truncate'}`}>{props.title}</span>{' '}
				{!props.selected && <Icon name="arrow-forward" size="small" />}
			</a>
		</div>
	);
}
