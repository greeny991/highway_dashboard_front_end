'use client';

import BaseModel from '@/components/base-model.component';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import Image from 'next/image';
import router from 'next/router';

interface Props {
	title: string;
	description: string;
	isOpen: boolean;
	cancelButtonText: string;
	confirmButtonText: string;
	handleAccept: () => void;
	handleReject: () => void;
}

export function ConfirmModalWidget(props: Props) {
	return (
		<BaseModel
			isOpen={props.isOpen}
			handleClose={props.handleReject}
			handleOutsideClick={props.handleReject}
		>
			<div className="relative w-2/5 h-fit max-w-[450px] xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] p-9">
				<div className="p-2" />
				<div className="absolute top-0 right-0 p-8 z-10">
					<Button type="icon" onClick={props.handleReject}>
						<Icon name="close" size="medium-large"></Icon>
					</Button>
				</div>
				<div className="relative z-1 flex flex-col w-full bg-gray-800 rounded-[8px] justify-center items-center">
					<div className="p-4" />
					<p className="font-primary font-normal text-[36px] text-white-100 uppercase  text-center">
						{props.title}
					</p>
					<div className="p-2" />
					<p className="font-primary font-normal text-[10px] text-gray-200 uppercase  text-center">
						{props.description}
					</p>
					<div className="p-2" />
					<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
					<div className="p-2" />
					<Button type="primary" fluid onClick={() => props.handleReject()}>
						{props.cancelButtonText}
					</Button>
					<div className="p-4" />
					<p
						className="font-primary font-normal text-[10px] text-gray-200 uppercase  text-center cursor-pointer"
						onClick={() => props.handleAccept()}
					>
						{props.confirmButtonText}
					</p>
				</div>
			</div>
		</BaseModel>
	);
}
