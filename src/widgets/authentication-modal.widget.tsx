'use client';

import { useEffect, useState } from 'react';
import BaseModel from '@/components/base-model.component';
import { AuthenticationWidget } from './authentication.widget';
import { Link } from '@/components/link.component';
import { OtpWidget } from './otp.widget';
import { Icon } from '@/components/icon/icon.component';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { useDla } from '@/contexts/dla.context';
import { useDto } from '@/contexts/dto.context';
import { IUser } from '@/interfaces/user.interface';

interface Props {
	isOpen: boolean;
	handleClose: (reload: boolean) => void;
	loginUI?: boolean;
	setIsRedirecting?: (value: boolean) => void; // Receive it
	redirectTo?: string;
}

export function AuthenticationModalWidget(props: Props) {
	const { data } = useDto();
	const { authenticator } = useAuthenticator();
	const { UserService } = useDla();

	const [isOtpUI, setIsOtpUI] = useState(false);
	const [isLoginUI, setLoginUI] = useState(props.loginUI ?? true); // Sync with prop

	// Sync state with props when modal opens
	useEffect(() => {
		setLoginUI(props.loginUI ?? true);
	}, [props.loginUI]);

	function createUser() {
		props.setIsRedirecting?.(true); // Only calls if it exists

		UserService.create({
			email: data.email,
			type: 'EMAIL'
		})
			.then((user: IUser) => {
				authenticator.setUser(user);
				props.handleClose(true);
			})
			.catch(() => props.handleClose(true));
	}

	return (
		<BaseModel
			isOpen={props.isOpen}
			handleClose={() => {
				props.setIsRedirecting?.(true); // Only calls if it exists
				props.handleClose(false);
			}}
		>
			<div className="relative w-[344px] xl:w-[518px] h-fit flex flex-col items-center bg-gray-800 rounded-[8px] gap-6 p-0">
				<div className="absolute top-4 right-6 z-10">
					<Icon
						name="close"
						size="medium"
						className="p-[4px] fill-gray-200 hover:fill-green-200 hover:cursor-pointer"
						onClick={() => {
							props.handleClose(false); // ❌ Do NOT set `setIsRedirecting(true)` here
						}}
					/>
				</div>

				{isOtpUI ? (
					<OtpWidget emit={() => createUser()} />
				) : isLoginUI ? (
					<AuthenticationWidget
						title="Log in"
						text="Don't have an account yet?"
						button="Sign In"
						link={<Link label="Register" type="primary" click={() => setLoginUI(false)} />}
						emit={() => setIsOtpUI(true)}
						fullWidth={true}
						redirectTo={props.redirectTo}
					/>
				) : (
					<AuthenticationWidget
						title="Create your account"
						text="Already have an account?"
						button="Sign Up"
						link={<Link label="Log in" type="primary" click={() => setLoginUI(true)} />}
						emit={() => setIsOtpUI(true)}
						fullWidth={true}
						isSignup={true}
						redirectTo={props.redirectTo}
					/>
				)}
			</div>
		</BaseModel>
	);
}
