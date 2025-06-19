'use client';

import { useEffect, useState } from 'react';

interface Props {
	label?: string;
	placeholder?: string;
	error?: string;
	hideErrorMessage?: boolean;
	value?: any;
	onChange: (value: any) => any;
	onBlur?: (value: any) => any;
}

export function InputDuration(props: Props) {
	const [inputValue, setInputValue] = useState(props.value);
	const [deleteKey, setDeleteKey] = useState(false);

	function handleChange(e: any) {
		let value = e.target.value;
		const previousValue = inputValue ? inputValue.replace(/[^0-9]/g, '').slice(0, 4) : '';

		value = value.replace(/[^0-9]/g, '').slice(0, 4);
		if (previousValue === value && deleteKey) {
			value = value.slice(0, -1);
		}

		let formattedTime = '';
		if (value.length > 2) {
			const hours = value.slice(0, -2);
			let minutes = value.slice(-2);

			if (parseInt(minutes, 10) > 59) {
				minutes = '59';
			}

			formattedTime = `${hours}h ${minutes}m`;
		} else if (value.length > 0) {
			formattedTime = `${value}h`;
		}

		setDeleteKey(false);
		setInputValue(formattedTime);
		props.onChange(formattedTime);
	}

	function handleKeyUp(e: any) {
		if (e.keyCode === 8 || e.key === 'Backspace') {
			setDeleteKey(true);
		}
	}

	useEffect(() => {
		setInputValue(props.value);
	}, [props.value]);

	return (
		<div className=" w-full">
			<div className="flex flex-row items-center justify-between">
				<label className="h-[12px] block mb-2 text-[8px] font-extralight uppercase text-white-60">
					{props.label}
				</label>
			</div>

			<input
				type="text"
				className={`${props.error && 'border border-red-200'} outline-none focus:outline-none h-[48px] bg-gray-900 text-[12px] text-white-100 placeholder:text-[12px] placeholder:text-white-60 rounded-lg block w-full p-2.5`}
				placeholder={props.placeholder}
				onKeyDown={handleKeyUp}
				onChange={handleChange}
				onBlur={(event) => {
					if (props.onBlur) {
						props.onBlur(event.target.value);
					}
				}}
				value={inputValue}
			/>

			{props.error && !props.hideErrorMessage && (
				<label typeof="error" className="block mt-2 text-[8px] font-extralight text-red-200">
					{props.error}
				</label>
			)}
		</div>
	);
}
