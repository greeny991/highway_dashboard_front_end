'use client';

import { Fragment, RefObject, useEffect, useRef, useState } from 'react';
import { DropdownItem } from './dropdown-item.component';

interface DropdownItem {
	name: string;
	asset?: string;
	divider?: boolean;
	danger?: boolean;
	hidden?: boolean;
	click: () => void;
}

interface Props {
	trigger: any;
	position?: string;
	items: DropdownItem[];
	changeState: (isOpened: boolean) => void;
}

export function Dropdown(props: Props) {
	const element = useRef<any>();
	const [isOpened, setIsOpened] = useState(false);

	useEffect(() => {
		const handler = (event: any) => {
			if (!element.current) {
				return;
			}
			if (
				!element.current.contains(event.target) &&
				!props.trigger.current.contains(event.target)
			) {
				setIsOpened(false);
				props.changeState(false);
			}
		};
		document.addEventListener('click', handler, true);
		return () => {
			document.removeEventListener('click', handler);
		};
	}, []);

	useEffect(() => {
		const handleClick = () => {
			const isOpened = JSON.parse(element.current.getAttribute('data-open'));
			setIsOpened(!isOpened);
			props.changeState(!isOpened);
		};
		props.trigger.current.addEventListener('click', handleClick);
		return () => {
			if (props.trigger.current) {
				props.trigger.current.removeEventListener('click', handleClick);
			}
		};
	}, []);

	return (
		<div
			className={`${props.position || 'right-[-4px] top-11'} p-[5px] absolute w-50 my-[2px] z-10 bg-gray-800 rounded-[8px] shadow-lg focus:outline-none ${isOpened ? '' : 'hidden'}`}
			ref={element}
			data-open={isOpened}
		>
			<div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
				<ul className="">
					{props.items
						.filter((i) => !i.hidden)
						.map((item, index) => (
							<Fragment key={index}>
								<div
									className="w-full"
									onClick={() => {
										setIsOpened(false);
										props.changeState(false);
										item.click();
									}}
								>
									{item.divider && <hr className="h-px mx-2 bg-white-10 border-0 rounded" />}
									<DropdownItem name={item.name} asset={item.asset} danger={item.danger} />
								</div>
							</Fragment>
						))}
				</ul>
			</div>
		</div>
	);
}
