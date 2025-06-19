'use client';

import { useState } from 'react';
import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';
import { Input } from './input.component';

interface Props {
	loading?: boolean;
	closeModel?: () => void;
	cancelChange?: () => void;
}

export function ChangeCompanyName(props: Props) {
	const [submitError, setSubmitError] = useState('');
	const [disabled, setDisabled] = useState(true);
	const [companyName, setCompanyName] = useState<string>('');
	function checkCompanyName(companyName: any) {
		const regex = new RegExp(/^\S+$/);
		setDisabled(!regex.test(companyName));
		setCompanyName(companyName);
	}
	return (
		<div className="w-[520px] h-fit max-w-[600px] xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] gap-6 py-12 px-6">
			<div className="flex flex-row justify-between w-full items-center">
				<div className={`flex flex-row items-center`}>
					<Icon
						name="briefcase"
						className="mr-[8px] p-[8px] bg-green-200  rounded-full fill-gray-925"
						size="small"
					/>
					<label className="block m-2 font-primary   text-[16px] text-white-100 font-normal uppercase overflow-hidden">
						<span className="line-clamp-2">Change Company Name</span>
					</label>
				</div>
				<Icon
					name="close"
					size="medium"
					className="p-[4px] fill-gray-200 hover:fill-green-200 hover:cursor-pointer"
					onClick={props.closeModel}
				/>
			</div>
			<div className="w-full flex flex-col gap-4">
				<Input
					label="Company Name"
					placeholder="Hiway"
					value={companyName}
					onChange={checkCompanyName}
					error={submitError}
				/>
				<Button type="primary" fluid disabled={disabled}>
					Save Changes
				</Button>
				<Button type="secondary" fluid onClick={props.cancelChange}>
					Cancel
				</Button>
			</div>
		</div>
	);
}
