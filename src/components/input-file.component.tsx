'use client';

import { useEffect, useState } from 'react';
import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';

interface Props {
	id: string;
	label?: string;
	src?: string;
	name?: string;
	error?: string;
	border?: boolean;
	buttonType?: 'primary' | 'secondary';
	buttonText?: string;
	changeButtonText?: string;
	accept: string;
	remove: () => void;
	onChange: (value: any) => any;
	onTrigger?: () => void;
}

export function InputFile(props: Props) {
	const [src, setSrc] = useState(props.src);
	const [name, setName] = useState(props.name);

	useEffect(() => {
		setSrc(props.src);
	}, [props.src]);

	useEffect(() => {
		setName(props.name);
	}, [props.name]);

	return (
		<div className="w-full">
			{props.label && (
				<label className="font-primary pb-2 text-[10px] font-light uppercase text-white-60 w-full flex">
					{props.label ? props.label : 'Company logo *'}
				</label>
			)}
			<div
				className={`
          ${props.border && !props.error && 'border border-gray-475'}
          ${props.error && 'border border-red-200'}
          flex flex-row justify-between h-[72px] bg-gray-900 rounded-lg w-full p-2.5 items-center
        `}
			>
				<div className="flex flex-row items-center">
					<div className="h-[48px] w-[48px]">
						<div className="bg-gray-500 rounded-[8px] flex justify-center items-center overflow-hidden h-[48px] w-[48px]">
							{!src && <Icon name="photo" color="fill-white-100" size="medium" />}
							{src && <img src={src} className="w-full h-full object-cover" />}
						</div>
					</div>
					<label className="font-primary   block m-2 uppercase text-white-100 dark:text-white overflow-hidden">
						{name && <span className="line-clamp-2 text-[13px] font-normal">{name}</span>}
						{!name && (
							<div className="flex flex-col">
								<span className="text-[13px] font-medium">
									{props.label ? props.label : 'Profile image'}
								</span>
								<span className="text-[10px] font-light text-gray-462">
									Please add image up to 2 mb
								</span>
							</div>
						)}
					</label>
				</div>

				<input
					type="file"
					id={props.id}
					className="absolute w-0 h-0 overflow-hidden"
					multiple={false}
					accept={props.accept}
					onChange={(event: any) => {
						setSrc(URL.createObjectURL(event.target.files[0]));
						setName(event.target.files[0].name);
						props.onChange(event.target.files[0]);
					}}
				/>

				{src && (
					<Button
						type="secondary"
						className={props.changeButtonText ? 'min-w-[118px]' : ''}
						square
						onClick={() => {
							if (props.onTrigger) {
								props.onTrigger();
							} else {
								props.remove();
								setSrc(undefined);
								setName(undefined);
							}
						}}
					>
						{props.changeButtonText || <Icon name="close" color="fill-white-100" size="medium" />}
					</Button>
				)}

				{!src && (
					<Button
						type={props.buttonType || 'primary'}
						className="min-w-[118px] bg-green-600 text-white-100"
						onClick={() => {
							if (props.onTrigger) {
								props.onTrigger();
							} else {
								const input: any = document.getElementById(props.id);
								input.click();
							}
						}}
					>
						{props.buttonText || 'Add image'}
					</Button>
				)}
			</div>

			{props.error && (
				<label
					typeof="error"
					className="font-primary block mt-2 text-[10px] font-extralight text-red-200 dark:text-white"
				>
					{props.error}
				</label>
			)}
		</div>
	);
}
