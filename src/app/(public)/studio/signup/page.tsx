'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthenticationWidget } from '@/widgets/authentication.widget';
import { Link } from '@/components/link.component';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { Loader } from '@/components/loader/loader.component';

export default function SignInPage() {
	const router = useRouter();
	const { authenticator } = useAuthenticator();
	const [showPage, setShowPage] = useState(false);

	function redirectAfterLogin(type: string) {
		switch (type) {
			case 'EMAIL':
				router.push('/studio/signup/otp', { scroll: false });
				break;
			case 'GOOGLE':
				router.push('/studio/signup/company', { scroll: false });
				break;
			case 'WALLET':
				router.push('/studio/signup/company', { scroll: false });
				break;
		}
	}
	useEffect(() => {
		if (authenticator.user) {
			router.push('/studio/media-catalogue', { scroll: false });
		} else {
			setShowPage(true);
		}
	}, []);

	return (
		<>
			{showPage && (
				<AuthenticationWidget
					title="Create your account"
					text="Already have an account?"
					button="Sign Up"
					link={
						<Link label="Log in" type="primary" click={() => router.replace('/studio/signin')} />
					}
					emit={(type: string) => redirectAfterLogin(type)}
					isSignup={true}
				/>
			)}
			{!showPage && (
				<div className="relative flex flex-col h-[610px] w-[90%] md:w-[90%] md:max-w-[348px] lg:w-[75%] lg:max-w-[520px] bg-gray-800 p-9 rounded-[8px] justify-center items-center">
					<Loader />
				</div>
			)}
		</>
	);
}
