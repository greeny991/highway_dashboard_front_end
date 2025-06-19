'use client';

import { useState } from 'react';
import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';
import { Input } from './input.component';
import { Link } from './link.component';
import { Loader } from './loader/loader.component';
import { OtpInput } from './otp-input.component';

interface Props {
	email: string;
	loading?: boolean;
	closeModel?: () => void;
	cancelChange?: () => void;
	submitOTP: (otp: string) => void;
}

export function ChangeEmail(props: Props) {
	const [verifyEmail, setVerifyEmail] = useState(false);
	function handleVerifyEmail(value: boolean) {
		setVerifyEmail(value);
	}
	const [submitError, setSubmitError] = useState('');
	const [disabled, setDisabled] = useState(true);
	const [email, setEmail] = useState<string>('');
	function checkEmail(email: any) {
		const regex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/);
		setDisabled(!regex.test(email));
		setEmail(email);
	}
	return (
		<div className="w-[520px] h-fit max-w-[600px] xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] gap-6 p-12">
			{props.loading && <Loader />}
			<div className="flex flex-row justify-between w-full items-center">
				<div className={`flex flex-row items-center`}>
					<Icon
						name="message"
						className="mr-[8px] p-[8px] bg-green-200  rounded-full fill-gray-925"
						size="small"
					/>
					<label className="block m-2 font-primary   text-[16px] text-white-100 font-normal uppercase overflow-hidden">
						<span className="line-clamp-2">Change e-mail</span>
					</label>
				</div>
				<Icon
					name="close"
					size="medium"
					className="p-[4px] fill-gray-200 hover:fill-green-200 hover:cursor-pointer"
					onClick={props.closeModel}
				/>
			</div>
			{verifyEmail ? (
				<div className="flex flex-col w-full gap-4">
					<div className="text-[14px] font-primary   font-normal text-white-100 uppercase">
						Verify your e-mail
					</div>
					<hr className="w-full h-px bg-white-10 border-0 rounded" />
					<div className="flex flex-col gap-4">
						<div className="flex flex-row justify-between">
							<div className="text-[10px] font-primary font-normal uppercase text-white-100">
								{email}
							</div>
							<Link label="Change" type="primary" click={() => handleVerifyEmail(false)} />
						</div>
						<div className="text-[10px] font-primary   font-normal text-white-60">
							We&apos;ve sent a One Time Password (OTP) to your email address. Please enter it
							below.
						</div>
					</div>
					<div>
						<OtpInput emit={(opt) => props.submitOTP(opt)} />
					</div>
					<Button type="secondary" fluid onClick={() => handleVerifyEmail(false)}>
						Cancel
					</Button>
				</div>
			) : (
				<div className="flex flex-col w-full gap-4">
					<Input
						label="E-mail address"
						placeholder="johndoe@hiway.com"
						value={email}
						onChange={checkEmail}
						error={submitError}
					/>
					<Button type="primary" fluid disabled={disabled} onClick={() => handleVerifyEmail(true)}>
						Continue
					</Button>
					<Button type="secondary" fluid onClick={props.cancelChange}>
						Cancel
					</Button>
				</div>
			)}
		</div>
	);
}
