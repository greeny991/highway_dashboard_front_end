'use client';

import BaseModel from '@/components/base-model.component';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import Image from 'next/image';

interface Props {
	error?: string;
	src?: string;
	description?: string;
	aditionalInfo?: string;
	isOpen: boolean;
	action?: string;
	handleAction: () => void;
	handleClose: () => void;
}

export function ErrorModelWidget(props: Props) {
	return (
		<BaseModel
			isOpen={props.isOpen}
			handleClose={props.handleClose}
			handleOutsideClick={() => props.handleClose}
		>
			<div className="relative w-2/5 h-fit max-w-[580px] xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] p-9">
				<div className="p-2" />
				<div className="absolute top-0 right-0 p-8">
					<Button type="icon" onClick={props.handleClose}>
						<Icon name="close" size="medium-large"></Icon>
					</Button>
				</div>
				<Image src={props.src ?? '/images/oops-error.png'} alt={'Icon'} height={112} width={112} />
				<div className="p-4" />
				<p className="font-primary font-normal text-[22px] text-white-100 uppercase  text-center">
					{props.error ?? 'Ups! Something went wrong'}
					{/* <span style={{ whiteSpace: 'pre-line' }}>404{'\n'}Page not found</span> */}
				</p>
				<div className="p-1" />
				{props.description && (
					<p className="font-primary font-normal text-[10px] text-gray-200 uppercase  text-center">
						{props.description}
					</p>
				)}
				<div className="p-2" />
				<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
				<div className="p-2" />
				<Button type="primary" fluid onClick={props.handleAction}>
					{props.action || 'Button'}
				</Button>
				{props.aditionalInfo && (
					<p className="font-primary pt-8 font-normal text-[10px] text-gray-200 uppercase  text-center">
						{props.aditionalInfo}
					</p>
				)}
			</div>
		</BaseModel>
	);
}
