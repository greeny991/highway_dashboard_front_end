'use client';

import { useState } from 'react';
import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';
import { Input } from './input.component';
import { Loader } from './loader/loader.component';

interface Props {
	loading?: boolean;
	closeModel?: () => void;
	cancelChange?: () => void;
	sendDataToParent: (arg: string) => void;
	username: string;
}

export function ChangeUsername(props: Props) {
	const [submitError, setSubmitError] = useState('');
	const [disabled, setDisabled] = useState(true);
	const [username, setUsername] = useState<string>(props.username);

	function checkUsername(username: string) {
		const regex = new RegExp(/^\S+$/);
		setDisabled(!regex.test(username));
		setUsername(username);
		setSubmitError('');
	}

	const handleSave = () => {
		console.log('Save clicked, username:', username);
		props.sendDataToParent(username);
	};

	return (
		<div className="w-[520px] h-fit max-w-[600px] xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] gap-6 p-12">
			{props.loading && <Loader backdrop={false} />}
			<div className="flex flex-row justify-between w-full items-center">
				<div className={`flex flex-row items-center`}>
					<Icon
						name="profile-round"
						className="mr-[8px] p-[8px] bg-green-200  rounded-full fill-gray-925"
						size="small"
					/>
					<label className="block m-2 font-primary   text-[16px] text-white-100 font-normal uppercase overflow-hidden">
						<span className="line-clamp-2">Change username</span>
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
				<Input label="Username" value={username} onChange={checkUsername} error={submitError} />
				<Button type="primary" fluid disabled={disabled || props.loading} onClick={handleSave}>
					Save Changes
				</Button>
				<Button type="secondary" fluid onClick={props.cancelChange} disabled={props.loading}>
					Cancel
				</Button>
			</div>
		</div>
	);
}
