'use client';

import { useState } from 'react';
import { Icon } from './icon/icon.component';

interface Props {
	title: string;
	scr: string;
	isActive?: boolean;
	click?: () => void;
}

export function TabItem(props: Props) {
	const [isHovered, setIsHovered] = useState(false);

	const handleHover = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};
	return (
		<li
			className={`flex flex-row relative w-full h-full justify-center items-center cursor-pointer ${props.isActive || isHovered ? 'nav-item-active pb-0' : 'pb-[2px]'}`}
			onMouseEnter={handleHover}
			onMouseLeave={handleMouseLeave}
			onClick={props.click}
		>
			<a
				className={`flex w-full justify-center items-center font-primary text-center font-normal ${props.isActive ? 'text-white-100' : 'text-gray-200'}`}
				aria-current="page"
			>
				<div className="flex gap-2 items-center">
					<Icon
						name={props.scr}
						size="medium"
						color={props.isActive ? 'fill-white-100' : 'fill-gray-200'}
					></Icon>
					<span className="inline-block">{props.title}</span>
				</div>
			</a>
		</li>
	);
}
