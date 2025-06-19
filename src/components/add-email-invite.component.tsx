'use client';

import { useEffect, useState } from 'react';
import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';
import { Input } from './input.component';
import { SelectOption } from './select-option.component';
import { z } from 'zod';

interface Props {
	title?: string;
	value: { name: string; position: string }[];
	error?: string;
	onChange: (value: { name: string; position: string }[]) => void;
}

const canViewOptions = [
	{
		label: 'Can View',
		value: 'eye',
		icon: <Icon name="eye" className="mr-[8px] p-[8px] fill-white-100" size="small" />
	},
	{
		label: 'Can view and download',
		value: 'download',
		icon: <Icon name="download" className="mr-[8px] p-[8px] fill-white-100" size="small" />
	}
];

const emailSchema = z.string().email({ message: 'Invalid email format' });

export function AddEmailInviteItem({ value, error, onChange }: Props) {
	const [values, setValues] = useState(value || []);
	const [position, setPosition] = useState(canViewOptions[0].value);
	const [name, setName] = useState('');
	const [emailError, setEmailError] = useState<string | null>(null);

	useEffect(() => {
		setValues(value);
	}, [value]);

	function removeItem(index: number) {
		const newValues = values.filter((_, i) => i !== index);
		onChange(newValues);
		setValues(newValues);
	}

	function changePosition(index: number, position: string) {
		const newValues = [...values];
		newValues[index].position = position;
		onChange(newValues);
		setValues(newValues);
	}

	function addNewItem() {
		if (values.length >= 5) {
			setEmailError('You can only add up to 5 emails.');
			return;
		}
		const validationResult = emailSchema.safeParse(name);

		if (!validationResult.success) {
			setEmailError(validationResult.error.errors[0].message);
			return;
		}

		setEmailError(null);

		const newValues = [...values, { position, name }];
		onChange(newValues);
		setValues(newValues);
		setPosition(canViewOptions[0].value);
		setName('');
	}

	// Function to handle Enter key press
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			addNewItem();
		}
	};

	return (
		<div className="w-full">
			{values.map((item, index) => (
				<div key={`${index}-${item.name}`} className="grid  gap-2 mb-1">
					<div className="w-full">
						<div
							className="h-[46px] w-full flex items-center cursor-pointer bg-gray-600 pt-[7px] pb-[7px] pl-[12px] mt-[2px] pr-[12px] rounded-[10px] mr-[5px]"
							onClick={() => removeItem(index)}
						>
							<span className="mr-[8px] block text-white-60 w-full">{item.name}</span>
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
					</div>
					{/* <div className="flex items-end gap-4">
						<SelectOption
							placeholder="Select Email"
							options={canViewOptions}
							onChange={(value) => changePosition(index, value[0])}
							value={[item.position]}
						/>
					</div> */}
				</div>
			))}

			<div className="">
				{values.length > 0 && <div className="p-1" />}
				<div className="flex gap-2   mb-1">
					<Input
						placeholder="Add email"
						value={name}
						onChange={setName}
						error={emailError || error}
						hidelabel
						onKeyDown={handleKeyDown} // Add the onKeyDown handler here
					/>
					{/* <SelectOption
						placeholder="Who can view"
						options={canViewOptions}
						onChange={(value) => setPosition(value[0])}
						value={[position]}
					/> */}
				</div>
			</div>

			{/*<div className="p-2" />
			<Button type="primary" iconColorType="primary" onClick={addNewItem}>
				<Icon
					name="add"
					className="mr-[8px] p-[6px] bg-gray-800 rounded-full fill-green-200"
					size="small"
				/>
				Add email
			</Button>*/}
			<div className="p-2" />
		</div>
	);
}
