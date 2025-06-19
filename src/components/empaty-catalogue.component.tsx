/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';

export function EmptyCatalogue({ addVideo }: { addVideo: () => void }) {
	return (
		<div className="flex w-full h-full items-center justify-center">
			<img src="/images/bg-left.png" alt="Left Image" className="absolute left-0 w-1/3 pl-8" />
			<div className="relative z-10 flex flex-col w-[90%] md:w-[90%] md:max-w-[348px] lg:w-[75%] lg:max-w-[668px] bg-gray-800 p-9 rounded-[8px] justify-center items-center">
				<Image
					src={'/icons/new-logo.svg'}
					alt="Highway Logo"
					height={32}
					width={32}
					className="xl:w-[50px] xl:h-[50px]"
				/>
				<div className="p-4" />
				<p className="font-primary font-normal text-[36px] text-white-100 uppercase  text-center">
					<span style={{ whiteSpace: 'pre-line' }}>
						Let&apos;s start
						<br />
						your media experience
					</span>
				</p>
				<div className="p-1" />
				<p className="font-primary font-normal text-[12px] text-gray-200 uppercase  text-center">
					Upload your first video file to Media Library
				</p>
				<div className="p-6" />
				<Button type="primary" onClick={addVideo}>
					<Icon name="add" className="mr-[8px] p-[6px] bg-gray-800 rounded-full" size="small" />
					Add new video
				</Button>
				<div className="p-2" />
				<p className="font-primary font-normal text-[10px] text-gray-200 uppercase  text-center">
					Lorem Ipsum Lorem Ipsum
				</p>
			</div>
			<img src="/images/bg-right.png" alt="Right Image" className="absolute right-0 w-1/3 pr-8" />
		</div>
	);
}
