'use client';

import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import BaseModel from '@/components/base-model.component';
import { useState } from 'react';
import { Input } from '@/components/input.component';

interface Props {
	isOpen: boolean;
	handleClose: () => void;
	label: string;
	placeholder: string;
	iconName: string;
	sendDataToParent: (arg: string) => void;
}

export function ChangeDataWidget(props: Props) {
	const [submitError, setSubmitError] = useState('');
	const [disabled, setDisabled] = useState(true);
	const [companyName, setCompanyName] = useState<string>('');
	function checkCompanyName(companyName: any) {
		const regex = new RegExp(/^\S+$/);
		setDisabled(!regex.test(companyName));
		setCompanyName(companyName);
	}

	return (
		<BaseModel isOpen={props.isOpen} handleClose={props.handleClose}>
			<div className="w-[520px] h-fit max-w-[600px] xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] gap-6 p-12">
				<div className="flex flex-row justify-between w-full items-center">
					<div className={`flex flex-row items-center`}>
						<Icon
							name={props.iconName}
							className="mr-[8px] p-[8px] bg-green-200  rounded-full fill-gray-925"
							size="small"
						/>
						<label className="block m-2 font-primary   text-[16px] text-white-100 font-normal uppercase overflow-hidden">
							<span className="line-clamp-2">Change {props.label}</span>
						</label>
					</div>
					<Icon
						name="close"
						size="medium"
						className="p-[4px] fill-gray-200 hover:fill-green-200 hover:cursor-pointer"
						onClick={props.handleClose}
					/>
				</div>
				<div className="w-full flex flex-col gap-4">
					<Input
						label={props.label}
						placeholder={props.placeholder}
						value={companyName}
						onChange={checkCompanyName}
						error={submitError}
					/>
					<Button
						type="primary"
						fluid
						disabled={disabled}
						onClick={() => {
							props.sendDataToParent(companyName);
							props.handleClose();
						}}
					>
						Save Changes
					</Button>
					<Button type="secondary" fluid onClick={props.handleClose}>
						Cancel
					</Button>
				</div>
			</div>
		</BaseModel>
	);
}
