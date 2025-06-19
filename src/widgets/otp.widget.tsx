'use client';

import { Button } from '@/components/button/button.component';
import { Link } from '@/components/link.component';
import { Loader } from '@/components/loader/loader.component';
import { OtpInput } from '@/components/otp-input.component';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { BoxWidget } from '@/widgets/box.widget';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDto } from '@/contexts/dto.context';

export function OtpWidget({ emit }: { emit: (newUser: boolean) => void }) {
	const router = useRouter();
	const { data } = useDto();
	const { authenticator } = useAuthenticator();
	const [loading, setLoading] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);
	const [submitError, setSubmitError] = useState('');
	const [resendError, setResendError] = useState('');
	const [resendSuccess, setResendSuccess] = useState(false);
	const [countdown, setCountdown] = useState(60);

	useEffect(() => {
		let timer: NodeJS.Timeout;
		if (countdown > 0) {
			timer = setInterval(() => {
				setCountdown((prev) => prev - 1);
			}, 1000);
		}
		return () => {
			if (timer) clearInterval(timer);
		};
	}, [countdown]);

	async function submit(otp: string) {
		setLoading(true);
		setSubmitError('');
		authenticator.verifyOtp(data?.email, otp).then((success) => {
			setLoading(false);
			if (success) {
				emit(true);
			} else {
				setSubmitError('Invalid code, please try again.');
			}
		});
	}

	const handleResendOtp = async () => {
		setResendLoading(true);
		setResendError('');
		setResendSuccess(false);

		try {
			const result = await authenticator.resendOtp(data?.email);
			console.log('Resend OTP result:', result);
			if (result.success) {
				setResendSuccess(true);
				setCountdown(60); // Start countdown after successful resend
				setTimeout(() => setResendSuccess(false), 3000);
			} else {
				setResendError(result.message);
			}
		} catch (error) {
			console.error('Error resending OTP:', error);
			setResendError('Failed to resend OTP. Please try again.');
		} finally {
			setResendLoading(false);
		}
	};

	return (
		<BoxWidget title="Please enter the code sent to your email">
			{loading && <Loader />}
			<div className="flex flex-col">
				<div className="flex flex-row justify-between">
					<div className="text-[10px] font-medium uppercase text-white-100">{data?.email}</div>
					<Link label="Change" type="primary" click={() => router.replace('/studio/signup')} />
				</div>
				<div className="text-[10px] pt-1 font-medium text-white-60">
					We&apos;ve sent a One Time Password (OTP) to your email address. Please enter it below.
				</div>
			</div>
			<div className="p-2" />
			<div>
				<OtpInput emit={submit} error={submitError} />
				<div className="flex justify-end mt-2">
					{countdown > 0 ? (
						<p className="text-[10px] text-gray-400">Resend code in {countdown}s</p>
					) : (
						<button
							onClick={handleResendOtp}
							disabled={resendLoading}
							className="text-[10px] text-green-200 hover:text-green-600 disabled:text-gray-400 disabled:cursor-not-allowed"
						>
							{resendLoading ? 'Resending...' : 'Resend code'}
						</button>
					)}
				</div>
			</div>
			<div className="p-2" />
			<div className="flex flex-col gap-2">
				{resendSuccess && (
					<p className="text-[10px] text-green-200 text-center">New code sent successfully!</p>
				)}
				{resendError && <p className="text-[10px] text-red-200 text-center">{resendError}</p>}
				<Button type="secondary" fluid onClick={() => router.replace('/studio/signup')}>
					Cancel
				</Button>
			</div>
		</BoxWidget>
	);
}
