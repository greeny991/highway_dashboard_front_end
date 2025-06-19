'use client';

import { Authenticator } from '@/contexts/authenticator/authenticator.interface';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import EmailOtpAuthenticator from './email-otp.strategy';

type AuthenticatorProviderProps = {
	children: ReactNode;
};

type AuthenticatorContext = {
	authenticator: Authenticator;
};

export function AuthenticatorProvider({ children }: AuthenticatorProviderProps) {
	const [startingAuthenticator, setStartingAuthenticator] = useState(true);
	const [authenticator, setAuthenticator] = useState<Authenticator>(new EmailOtpAuthenticator());

	useEffect(() => {
		authenticator.setUserFromStorage();
		authenticator.setTokenFromStorage();
		setStartingAuthenticator(false);
	}, []);

	return (
		<AuthenticatorContext.Provider
			value={{
				authenticator
			}}
		>
			{startingAuthenticator && <></>}
			{!startingAuthenticator && children}
		</AuthenticatorContext.Provider>
	);
}

export const AuthenticatorContext = createContext({} as AuthenticatorContext);

export function useAuthenticator() {
	return useContext(AuthenticatorContext);
}
