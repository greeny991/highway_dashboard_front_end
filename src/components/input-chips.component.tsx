'use client';

import { useRef, useState } from 'react';

interface Props {
	label?: string;
	placeholder: string;
	error?: string;
	value?: string[];
	onChange: (value: any) => any;
}

export function InputChips({ label, placeholder, error, value = [], onChange }: Props) {
	const inputRef = useRef<any>();
	const [values, setValues] = useState(value);

	function onKeyUp(event: any) {
		if (event.keyCode === 13 || event.key === 'Enter') {
			const newValue = event.target.value;
			const exist = values.find((v) => v === newValue);
			(inputRef.current as HTMLInputElement).value = '';

			if (!exist) {
				const newValues = [...values, newValue];
				setValues(newValues);
				onChange(newValues);
			}
		}
	}

	function removeItem(value: string) {
		const newValues = values.filter((v) => v !== value);
		setValues(newValues);
		onChange(newValues);
	}

	return (
		<div className=" w-full">
			<div className="flex flex-row items-center justify-between">
				{label && (
					<label className="block mb-2 text-[8px] font-extralight uppercase text-white-60">
						{label}
					</label>
				)}
			</div>

			<div
				className={`${error && 'border border-red-200'} flex flex-wrap items-center bg-gray-900 text-[12px] text-white-100 placeholder:text-[12px] placeholder:text-white-60 rounded-lg w-full`}
			>
				{values.length > 0 && (
					<div className="pl-2.5 flex flex-wrap">
						{values.map((value, index) => (
							<div
								key={value}
								className="h-[27px] flex items-center cursor-pointer bg-gray-600 pt-[8px] pb-[8px] pl-[12px] mt-[2px] pr-[12px] rounded-[100px] mr-[5px]"
								onClick={(event) => removeItem(value)}
							>
								<span className="mr-[8px] block">{value}</span>
								<svg
									width="12"
									height="12"
									viewBox="0 0 12 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g opacity="0.6">
										<path
											fillRule="evenodd"
											clipRule="evenodd"
											d="M2.46967 2.46967C2.76256 2.17678 3.23744 2.17678 3.53033 2.46967L6 4.93934L8.46967 2.46967C8.76256 2.17678 9.23744 2.17678 9.53033 2.46967C9.82322 2.76256 9.82322 3.23744 9.53033 3.53033L7.06066 6L9.53033 8.46967C9.82322 8.76256 9.82322 9.23744 9.53033 9.53033C9.23744 9.82322 8.76256 9.82322 8.46967 9.53033L6 7.06066L3.53033 9.53033C3.23744 9.82322 2.76256 9.82322 2.46967 9.53033C2.17678 9.23744 2.17678 8.76256 2.46967 8.46967L4.93934 6L2.46967 3.53033C2.17678 3.23744 2.17678 2.76256 2.46967 2.46967Z"
											fill="white"
										/>
									</g>
								</svg>
							</div>
						))}
					</div>
				)}
				<input
					ref={inputRef}
					type="text"
					id="cast"
					className={`h-[48px] flex-1 flex-shrink-0 basis-[220px] bg-gray-900 text-[12px] text-white-100 placeholder:text-[12px] placeholder:text-white-60 rounded-lg w-full p-2.5 outline-none focus:outline-none`}
					placeholder={placeholder}
					onKeyUp={onKeyUp}
				/>
			</div>

			{error && (
				<label typeof="error" className="block mt-2 text-[8px] font-extralight text-red-200">
					{error}
				</label>
			)}
		</div>
	);
}
