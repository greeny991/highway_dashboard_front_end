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

export function ChangeCompanyWebsite(props: Props) {
	const [submitError, setSubmitError] = useState('');
	const [disabled, setDisabled] = useState(true);
	const [website, setWebsite] = useState<string>('');
	function checkWebsite(website: any) {
		const regex = new RegExp(
			/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w]{1,7}(?:[\w-./?%&'+=#])?$/
		);
		setDisabled(!regex.test(website));
		setWebsite(website);
	}
	return (
		<div className="w-[520px] h-fit max-w-[600px] xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] gap-6 py-12 px-6">
			<div className="flex flex-row justify-between w-full items-center">
				<div className={`flex flex-row items-center`}>
					<Icon
						name="globe"
						className="mr-[8px] p-[8px] bg-green-200  rounded-full fill-gray-925"
						size="small"
					/>
					<label className="block m-2 font-primary text-[16px] text-white-100 font-medium uppercase overflow-hidden">
						<span className="line-clamp-2">Change Company Website xxx</span>
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
					label="Website"
					//placeholder="Hiway.com"
					value={website}
					onChange={checkWebsite}
					error={submitError}
				/>
				<Button type="primary" fluid onClick={props.closeModel}>
					Continue
				</Button>
				<Button type="secondary" fluid onClick={props.cancelChange}>
					Cancel
				</Button>
			</div>
		</div>
	);
}
