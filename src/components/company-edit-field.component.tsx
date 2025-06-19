'use client';

import { useState } from 'react';
import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';
import { Toggle } from './toggle.component';
import { ChangeDataWidget } from '@/widgets/change-data.widget';

interface Props {
	label: string;
	scr: string;
	title: string;
	toggle?: boolean;
	toggleValue?: boolean;
	error?: string;
	change?: () => void;
	toggleChange?: () => void;
	handleDataFromChild?: (arg?: string) => void;
}

export function CompanyEditField(props: Props) {
	const [changeDataModal, setChangeDataModal] = useState(false);

	const [newValue, setNewValue] = useState(props.title);

	const handleDataFromChild = (val: string) => {
		setNewValue(val);
		props.handleDataFromChild?.(val); // Pass to parent
	};

	return (
		<div className="w-full">
			<label className="block mb-2 font-primary text-[10px] font-light uppercase text-white-60">
				{props.label}
			</label>
			<div
				className={`${props.error && 'border border-red-200'} flex flex-row justify-between h-[72px] bg-gray-900 rounded-lg w-full p-2.5 items-center`}
			>
				<div className="flex flex-row items-center">
					<div className="h-[48px] w-[48px]">
						<div className="flex justify-center items-center overflow-hidden h-full w-full">
							<Icon name={props.scr} color="fill-white-100" size="medium-large" />
						</div>
					</div>
					<label className="block mx-2 font-primary text-[13px] font-medium uppercase text-white-100 dark:text-white overflow-hidden">
						{props.title}
					</label>
				</div>
				{props.toggle && <Toggle value={props.toggleValue} onChange={props.toggleChange} />}
				{!props.toggle && (
					<Button
						type="secondary"
						className="min-w-[118px]"
						onClick={() => {
							setChangeDataModal(true);
						}}
					>
						Change
					</Button>
				)}
			</div>

			{props.error && (
				<label
					typeof="error"
					className="block mt-2 text-[8px] font-extralight text-red-200 dark:text-white"
				>
					{props.error}
				</label>
			)}

			<ChangeDataWidget
				label={props.label}
				iconName={props.scr}
				placeholder={props.title}
				isOpen={changeDataModal}
				handleClose={() => setChangeDataModal(false)}
				sendDataToParent={handleDataFromChild} // Pass data up
			/>
		</div>
	);
}
