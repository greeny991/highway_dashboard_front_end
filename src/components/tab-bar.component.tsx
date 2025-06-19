'use client';

import { TabItem } from './tab-item.component';

interface ITabItem {
	title: string;
	src: string;
}

interface Props {
	active: number;
	items: ITabItem[];
	click: (selected: number) => void;
}

export function TabBar(props: Props) {
	return (
		<nav className="h-[75px] w-full bg-gray-925 border-b border-white-10">
			<div className="h-full">
				<ul className="flex flex-row items-center justify-between h-full w-full gap-2">
					{props.items.map((item, index) => (
						<TabItem
							key={index}
							title={item.title}
							scr={item.src}
							isActive={props.active === index}
							click={() => props.click(index)}
						/>
					))}
				</ul>
			</div>
		</nav>
	);
}
