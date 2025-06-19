'use client';

import { useEffect, useState } from 'react';
import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';
import { Input } from './input.component';
import { SelectOption } from './select-option.component';
import '/node_modules/flag-icons/css/flag-icons.min.css';

interface ICrew {
	position: string;
	name: string;
}

interface Props {
	title?: string;
	value?: ICrew[];
	error?: string;
	onChange: (value: any) => any;
}

export function AddCrewItem(props: Props) {
	const [values, setValues] = useState<any>([]);
	const [position, setPosition] = useState<any>('');
	const [name, setName] = useState<any>('');

	useEffect(() => {
		if (props.value) {
			setValues([...props.value]);
		}
	}, []);

	function removeItem(index: number) {
		const newValues = [...values].filter((v, i) => i !== index);

		props.onChange(newValues);
		setValues(newValues);
	}

	function changePosition(index: number, position: string) {
		const newValues = [...values];

		newValues[index].position = position;
		props.onChange(newValues);
		setValues(newValues);
	}

	function changeName(index: number, name: string) {
		const newValues = [...values];

		newValues[index].name = name;
		props.onChange(newValues);
		setValues(newValues);
	}

	function addNewItem() {
		if (position && name) {
			const newValues = [...values, { position, name }];

			props.onChange(newValues);
			setValues(newValues);
			setPosition('');
			setName('');
		}
	}

	return (
		<div>
			<label className="block mb-2 text-[8px] font-extralight uppercase text-white-60">Crew</label>
			<div className="flex flex-col gap-2">
				{values?.map((item: any, index: number) => (
					<div key={`${index}-${item.name}`} className="flex w-full gap-4">
						<div className="w-1/3">
							<SelectOption
								placeholder="Select Crew"
								options={[
									{
										label: 'Director',
										value: 'director'
									},
									{
										label: 'Producer',
										value: 'producer'
									}
								]}
								onChange={(value) => changePosition(index, value[0])}
								value={[item.position]}
							/>
						</div>
						<div className="flex w-full items-end gap-4">
							<Input
								placeholder="Add crew member"
								value={item.name}
								onChange={() => {}}
								onBlur={(value) => changeName(index, value)}
								hidelabel
							/>
							<div>
								<Button type="secondary" square onClick={() => removeItem(index)}>
									<Icon name="close" color="fill-white-100" size="medium" />
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
			{values?.length > 0 && <div className="p-1" />}
			<div className="flex w-full gap-4">
				<div className="w-1/3">
					<SelectOption
						placeholder="Select Crew"
						options={[
							{
								label: 'Director',
								value: 'director'
							},
							{
								label: 'Producer',
								value: 'producer'
							}
						]}
						onChange={(value) => setPosition(value[0])}
						value={[position]}
						error={props.error}
					/>
				</div>
				<div className="flex w-full">
					<Input
						placeholder="Add crew member"
						onChange={(value) => setName(value)}
						value={name}
						error={props.error}
						hideErrorMessage={true}
						hidelabel
					/>
				</div>
			</div>

			<div className="p-3" />
			<Button type="primary" iconColorType="primary" onClick={addNewItem}>
				<Icon
					name="add"
					className="mr-[8px] p-[6px] bg-gray-800 rounded-full fill-green-200"
					size="small"
				/>
				Add crew member
			</Button>
		</div>
	);
}
