'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { DropdownMenuItem } from './dropdown-menu-item.component';

interface DropdownItem {
	name: string;
	comingSoon?: boolean;
	click: () => void;
}

interface Props {
	trigger: any;
	items: DropdownItem[];
	changeState: (isOpened: boolean) => void;
}

export function DropdownMenu(props: Props) {
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
			className={`left-0 top-[78px] absolute p-[5px] w-50 my-[2px] z-10 bg-gray-800 rounded-[8px] shadow-lg focus:outline-none ${isOpened ? '' : 'hidden'}`}
			ref={element}
			data-open={isOpened}
		>
			<div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
				{props.items.map((item, index) => (
					<Fragment key={index}>
						<div
							className="w-full"
							onClick={() => {
								setIsOpened(false);
								props.changeState(false);
								item.click();
							}}
						>
							<DropdownMenuItem name={item.name} comingSoon={item.comingSoon} />
						</div>
					</Fragment>
				))}
			</div>
		</div>
	);
}
