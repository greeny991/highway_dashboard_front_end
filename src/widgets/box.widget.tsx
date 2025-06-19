'use client';

import Image from 'next/image';

interface Props {
	title: string;
	children?: any;
	fullWidth?: boolean;
}

export function BoxWidget(props: Props) {
	return (
		<div
			className={`${props.fullWidth ? 'w-full' : ' w-[90%] md:w-[90%] md:max-w-[348px] lg:w-[75%] lg:max-w-[520px]'} relative flex flex-col bg-gray-800 p-9 rounded-[8px] justify-center items-center`}
		>
			<Image
				src={'/icons/new-logo.svg'}
				alt="Hiway Logo"
				height={32}
				width={32}
				className="xl:w-[50px] xl:h-[50px]"
			/>
			<div className="p-4 xl:p-6" />
			<p className="font-primary font-normal text-[16px] xl:text-[22px] text-white-100 uppercase  text-center">
				{props.title}
			</p>
			<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
			{props.children}
		</div>
	);
}
