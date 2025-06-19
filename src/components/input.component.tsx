'use client';

import { useEffect, useState } from 'react';
import { Icon } from './icon/icon.component';

interface Props {
	name?: string;
	label?: string;
	hidelabel?: boolean;
	placeholder?: string;
	error?: string;
	hideErrorMessage?: boolean;
	typeof?: string;
	hideMaxLength?: boolean;
	maxLength?: number;
	textarea?: boolean;
	value?: any;
	disabled?: boolean;
	centeredText?: boolean;
	border?: boolean;
	height?: string;
	onChange: (value: any) => any;
	onBlur?: (value: any) => any;
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>; // Add this line
	showCopyButton?: boolean;
}

export function Input(props: Props) {
	const [inputValue, setInputValue] = useState(props.value || '');
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		setInputValue(props.value);
	}, [props.value]);

	const handleCopy = () => {
		navigator.clipboard.writeText(inputValue);
		setIsCopied(true);
		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};

	return (
		<div className="w-full">
			{!props.hidelabel && (
				<div className="font-primary mb-[5px] uppercase font-extralight flex flex-row items-center justify-between">
					<label className="block text-[10px] text-white-60">{props.label}</label>
					{props.showCopyButton && (
						<button className="flex flex-row items-center cursor-pointer">
							{isCopied ? (
								<Icon name="check" className="mr-[8px] p-[8px] fill-white-100 " size="small" />
							) : (
								<Icon
									name="copy"
									className="mr-[8px] p-[8px] fill-white-100 hover:stroke-green-200"
									size="small"
									onClick={handleCopy}
								/>
							)}
						</button>
					)}
				</div>
			)}
			{props.textarea ? (
				<textarea
					maxLength={props.maxLength}
					className={`${props.error && 'border border-red-200'} font-primary  outline-none focus:outline-none h-[148px] bg-gray-900 text-[12px] text-white-100 placeholder:text-white-60 rounded-lg block w-full p-2.5`}
					placeholder={props.placeholder}
					onChange={(event) => {
						setInputValue(event.target.value);
						props.onChange(event.target.value);
					}}
					onBlur={(event) => {
						if (props.onBlur) {
							props.onBlur(event.target.value);
						}
					}}
					value={inputValue ?? ''}
					disabled={props.disabled}
					name={props.name}
				/>
			) : (
				<input
					type={props.typeof || 'text'}
					name={props.name}
					className={`
            ${props.border && !props.error && 'border border-gray-475'}
            ${!props.border && !props.error && 'border border-transparent'}
            ${props.error && 'border border-red-200'}
            ${!props.border && !props.error && 'border border-gray-900'}
            ${props.centeredText && 'text-center'}
            ${props.height && props.height}
            font-primary outline-none focus:outline-none h-[32px]  xl:h-[48px] bg-gray-900 text-[11px] xl:text-[12px] font-normal text-white-100 placeholder:text-white-60 rounded-lg block w-full p-2.5
          `}
					placeholder={props.placeholder}
					onChange={(event) => {
						setInputValue(event.target.value);
						props.onChange(event.target.value);
					}}
					onBlur={(event) => {
						if (props.onBlur) {
							props.onBlur(event.target.value);
						}
					}}
					onKeyDown={props.onKeyDown} // Pass the onKeyDown prop here for input
					value={inputValue ?? ''}
					disabled={props.disabled}
					maxLength={props.maxLength || 500}
				/>
			)}
			{props.maxLength && !props.hideMaxLength && (
				<div className="font-primary mt-2 uppercase font-extralight flex flex-row items-center justify-end">
					<label className="block text-[10px] text-gray-150">
						{(inputValue ? inputValue.length : 0) + '/' + props.maxLength + ' characters'}
					</label>{' '}
				</div>
			)}
			{props.error && !props.hideErrorMessage && (
				<label
					typeof="error"
					className="font-primary block mt-2 text-[10px] font-extralight text-red-200"
				>
					{props.error}
				</label>
			)}
		</div>
	);
}
