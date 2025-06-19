'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { IUser } from '@/interfaces/user.interface';
import { Loader } from '@/components/loader/loader.component';

export default function AuthCallback() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { authenticator } = useAuthenticator();

	useEffect(() => {
		const handleCallback = async () => {
			const accessToken = searchParams.get('accessToken');
			const refreshToken = searchParams.get('refreshToken');
			const userId = searchParams.get('userId');
			const companyId = searchParams.get('companyId');
			const role = searchParams.get('role');
			const email = searchParams.get('email');

			if (!accessToken || !refreshToken || !userId || !email) {
				router.push('/auth/signin');
				return;
			}

			// Create user object from params
			const user: IUser = {
				id: userId,
				email: email,
				companyId: companyId === 'null' || companyId === null ? undefined : companyId,
				role: role || undefined
			};

			// Set user and tokens in authenticator
			authenticator.setUser(user);
			localStorage.setItem('auth-access-token', accessToken);
			localStorage.setItem('auth-refresh-token', refreshToken);
			authenticator.setTokenFromStorage();

			// get redirect path from local storage
			const redirectTo = localStorage.getItem('redirectTo');
			if (redirectTo) {
				// remove redirect path from local storage
				localStorage.removeItem('redirectTo');
				router.push(redirectTo);
				return;
			}

			// if companyId is null or undefined, redirect /studio/signup/company
			if (!companyId || companyId === 'null') {
				router.push('/studio/signup/company');
				return;
			}

			// Redirect to dashboard or home page

			router.push('/studio');
		};

		handleCallback();
	}, [searchParams, router, authenticator]);

	return (
		<main className="relative h-full flex items-center justify-center">
			<Loader backdrop={false} />
		</main>
	);
}
