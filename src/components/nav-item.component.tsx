'use client';

import { useEffect, useState } from 'react';

interface Props {
	title?: string;
	routes?: string[];
	click?: () => void;
}

export function NavItem(props: Props) {
	const [isHovered, setIsHovered] = useState(false);
	const [isActive, setIsActive] = useState(false);

	const handleHover = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	useEffect(() => {
		if (props.routes) {
			const isActive = props.routes.find((r) => r === window.location.pathname);
			setIsActive(!!isActive);
		}
	}, [window.location.pathname]);

	return (
		<li
			className={`flex relative h-full items-center cursor-pointer ${isActive || isHovered ? 'nav-item-active pb-0' : 'pb-[2px]'}`}
			onMouseEnter={handleHover}
			onMouseLeave={handleMouseLeave}
			onClick={props.click}
		>
			<a className="block text-white-100" aria-current="page">
				{props.title}
			</a>
		</li>
	);
}
