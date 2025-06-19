'use client';

import { useEffect, useRef, useState } from 'react';
import { SelectDropdown } from './select-dropdown.component';

interface Option {
	label: string;
	value: any;
	icon?: React.ReactNode; // Accept an icon component
}
interface Props {
	label?: string;
	value?: string[] | undefined;
	multiSelection?: boolean;
	options: Option[];
	disabled?: boolean;
	error?: string;
	placeholder?: string;
	hideErrorMessage?: boolean;
	border?: boolean;
	onChange: (value: string[]) => void;
}

export function SelectOption(props: Props) {
	const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
	const dropdownTrigger = useRef<any>(null);
	const items = props.options.map((option, index) => ({
		label: option.label, // Ensure it's a string
		value: option.value,
		icon: option.icon, // Store the icon separately

		click: (selected: boolean) => {
			let newSelected: Option[] = [];
			if (props.multiSelection) {
				if (selected) {
					newSelected = [...selectedOptions, props.options[index]];
				} else {
					newSelected = selectedOptions.filter((item) => item.value !== option.value);
				}
			} else {
				newSelected = [props.options[index]];
			}

			props.onChange(newSelected.map((option) => option.value));
			setSelectedOptions(newSelected);
		}
	}));

	function removeItem(value: any) {
		const newSelected = selectedOptions.filter((item) => item.value !== value);
		setSelectedOptions(newSelected);
	}

	useEffect(() => {
		if (props.value) {
			console.log(props.value);
			const options = props.options.filter((option: Option) => props.value?.includes(option.value));
			setSelectedOptions(options);
		}
	}, []);

	return (
		<div className="relative w-full">
			{props.label && (
				<label className="block mb-[5px] text-[10px] font-light uppercase text-white-60">
					{props.label}
				</label>
			)}
			<div
				className={`
          ${props.border && !props.error && 'border border-gray-460'}
          ${props.error && 'border border-red-200'}
          flex items-center h-[48px] bg-gray-900 text-[12px] text-white-100 placeholder:text-[12px] placeholder:text-white-60 rounded-lg w-full p-2.5
          ${!props.multiSelection && !props.disabled ? 'cursor-pointer' : ''}
        `}
				ref={!props.multiSelection ? dropdownTrigger : null}
			>
				{!props.multiSelection && (
					<div className="flex flex-grow">
						{!selectedOptions[0]?.label && (
							<div className="text-white-60 pointer-events-none">{props.placeholder}</div>
						)}
						{selectedOptions[0] && (
							<div className="flex items-center gap-2">
								<span>{selectedOptions[0].label}</span>
							</div>
						)}
					</div>
				)}
				{props.multiSelection && (
					<div className="flex">
						{selectedOptions.length === 0 && (
							<div className="flex flex-grow text-white-60 pointer-events-none absolute top-9">
								{props.placeholder}
							</div>
						)}
						{selectedOptions.map((option: any) => (
							<div
								key={option.value}
								className="h-[35px] flex items-center cursor-pointer bg-gray-600 pt-[5px] pb-[5px] pl-[15px] pr-[15px] rounded-[100px] mr-[5px]"
								onClick={(event) => removeItem(option.value)}
							>
								<span className="mr-[8px] block">{option.label}</span>
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

				{!props.disabled && (
					<div
						className={`cursor-pointer h-full flex justify-end items-center ${props.multiSelection ? 'flex-grow' : ''}`}
						ref={props.multiSelection ? dropdownTrigger : null}
					>
						<svg
							width="10"
							height="6"
							viewBox="0 0 10 6"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M0.646447 0.646447C0.841709 0.451184 1.15829 0.451184 1.35355 0.646447L5 4.29289L8.64645 0.646447C8.84171 0.451184 9.15829 0.451184 9.35355 0.646447C9.54882 0.841709 9.54882 1.15829 9.35355 1.35355L5.35355 5.35355C5.15829 5.54882 4.84171 5.54882 4.64645 5.35355L0.646447 1.35355C0.451184 1.15829 0.451184 0.841709 0.646447 0.646447Z"
								fill="#A5A5A5"
							/>
						</svg>
					</div>
				)}
			</div>
			{!props.disabled && (
				<SelectDropdown
					trigger={dropdownTrigger}
					items={items}
					multiSelection={props.multiSelection}
					values={selectedOptions}
				/>
			)}

			{props.error && !props.hideErrorMessage && (
				<label typeof="error" className="block mt-2 text-[10px] font-extralight text-red-200">
					{props.error}
				</label>
			)}
		</div>
	);
}
