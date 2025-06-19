'use client';

import { useState } from 'react';
import { Button } from '@/components/button/button.component';
import { GoogleAuthentication } from '@/components/google-authentication.component';
import { Icon } from '@/components/icon/icon.component';
import { Input } from '@/components/input.component';
import { Link } from '@/components/link.component';
import { WalletAuthentication } from '@/components/wallet-authentication.component';
import { BoxWidget } from '@/widgets/box.widget';
import { Loader } from '@/components/loader/loader.component';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { useDto } from '@/contexts/dto.context';

type AuthType = 'email' | 'google' | 'wallet';

export function AuthenticationWidget({
	title,
	text,
	button,
	link,
	emit,
	isSignup = false,
	redirectTo
}: any) {
	const { setData } = useDto();
	const { authenticator } = useAuthenticator();
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState<string>('');
	const [submitError, setSubmitError] = useState('');
	const [authType, setAuthType] = useState<AuthType>('email');

	function authTypeChange(type: AuthType) {
		setAuthType(type);
	}

	function checkEmail(event: string) {
		const regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
		setDisabled(!regex.test(event));
		setEmail(event);
	}

	function signinByEmail() {
		setLoading(true);
		setSubmitError('');
		authenticator.requestOtp(email, isSignup).then(
			(response) => {
				console.log(response);
				setLoading(false);
				if (response.success) {
					setData({ email });
					emit('EMAIL');
				} else {
					setSubmitError(
						response.message || 'Failed to send OTP. Please check your email and try again.'
					);
				}
			},
			() => {
				setLoading(false);
				setSubmitError('Unexpected error. Please try again.');
			}
		);
	}

	function signinByGoogle() {
		if (redirectTo) {
			localStorage.setItem('redirectTo', redirectTo);
		}
		window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`;
	}

	function signinByWallet() {
		//TODO implement
		//emit('WALLET')
	}

	return (
		<BoxWidget title={title}>
			{loading && <Loader />}
			{authType == 'email' && (
				<div className="w-full">
					<Input
						label="Email Address"
						placeholder="johndoe@example.com"
						onChange={(value: string) => checkEmail(value)}
						error={submitError}
					/>
					<div className="p-2" />
					<Button type="primary" fluid disabled={disabled} onClick={signinByEmail}>
						{button}
					</Button>
				</div>
			)}
			{authType == 'wallet' && (
				<div className="w-full">
					<WalletAuthentication label="Metamask" isWalletInstalled />
					<div className="p-1" />
					<WalletAuthentication label="Coinbase Wallet" />{' '}
				</div>
			)}
			<div className="p-2" />
			<div className="flex flex-row ">
				<div className="text-[10px] px-1 font-medium uppercase text-white-60">{text}</div>
				{link}
			</div>
			<div className="flex items-center w-full  my-4">
				<hr className="w-full h-px bg-white-10 border-0 rounded" />
				<label
					typeof="email"
					className="block mx-4 text-[10px] font-medium text-white-30 text-nowrap"
				>
					Or continue with
				</label>
				<hr className="w-full h-px bg-white-10 border-0 rounded" />
			</div>
			{authType != 'email' && (
				<div className="w-full">
					<Button type="secondary" fluid onClick={() => authTypeChange('email')}>
						Email <Icon name="email" className="pl-[8px]" />
					</Button>
					<div className="p-1" />
				</div>
			)}

			<Button type="secondary" fluid onClick={signinByGoogle}>
				Google <Icon name="google" className="pl-[8px]" />
			</Button>
			<div className="p-1" />

			<div className="p-2" />
			<div className="flex flex-row ">
				<Link label="Privacy" />
				<div className="text-[10px] px-1 font-medium uppercase text-white-60">•</div>
				<Link label="Terms" />
			</div>
		</BoxWidget>
	);
}
