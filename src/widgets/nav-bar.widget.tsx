'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { NavItem } from '@/components/nav-item.component';
import { useRouter } from 'next/navigation';
import { ProfileWidget } from '@/widgets/profile.widget';

export function NavBarWidget() {
	const router = useRouter();

	return (
		<nav className="h-[75px] w-full z-30 bg-gray-468 border-b border-white-10">
			<div className="flex flex-wrap h-full items-center justify-between mx-5">
				<div className="flex items-center justify-between h-full">
					<div className="cursor-pointer" onClick={() => router.push('/', { scroll: false })}>
						<Image
							src={'/icons/new-logo.svg'}
							alt="Hiway Logo"
							height={32}
							width={32}
							className="xl:w-[50px] xl:h-[50px]"
						/>
					</div>
					<div className="p-2" />
					<ul className="flex space-x-4 mx-4 items-center h-full">
						<NavItem
							title="Home"
							routes={['/']}
							click={() => {
								router.push('/', { scroll: false });
							}}
						/>
					</ul>
				</div>
				<div className="flex items-center">
					<ProfileWidget />
				</div>
			</div>
		</nav>
	);
}
