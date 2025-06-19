'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { useHttpClient } from '@/contexts/http-client/http-client.context';
import { useDla } from '@/contexts/dla.context';

type HttpInterceptorProviderProps = {
	children: ReactNode;
};

export function HttpInterceptorProvider({ children }: HttpInterceptorProviderProps) {
	const { httpClient } = useHttpClient();
	const { authenticator } = useAuthenticator();
	const [settingupInterceptor, setSettingupInterceptor] = useState(true);

	async function signout() {
		await authenticator.signout();
		if (window.location.href.includes('/studio')) {
			window.location.replace('/studio/signin');
		}
		if (window.location.href.includes('/account')) {
			window.location.replace('/');
		}
	}

	async function refreshToken(): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				if (!authenticator.refreshToken) {
					reject(new Error('No refresh token available'));
					return;
				}
				const refreshSuccess = await authenticator.handleRefreshToken(authenticator.refreshToken);

				if (refreshSuccess) {
					resolve(true);
				} else {
					signout();
				}
			} catch (error) {
				signout();
			}
		});
	}

	useEffect(() => {
		let refreshTokenPromise: any = null;

		const error = async (error: any) => {
			// return new Promise((resolve, reject) => reject(error));
			return new Promise(async (resolve, reject) => {
				const ignoreURL = error.config.url.includes('v1/sessions');

				if (!ignoreURL && error.response.status === 401 && !error.config._retry) {
					error.config._retry = true;

					if (!authenticator.refreshToken) {
						reject(error);
						return;
					}

					if (refreshTokenPromise) {
						const refreshTokenSuccess = await refreshTokenPromise;

						if (refreshTokenSuccess) {
							error.config.headers['Authorization'] = `Bearer ${authenticator.accessToken}`;
							resolve(error);
						}
					} else {
						refreshTokenPromise = refreshToken();
						const refreshTokenSuccess = await refreshTokenPromise;
						refreshTokenPromise = null;

						if (refreshTokenSuccess) {
							error.config.headers['Authorization'] = `Bearer ${authenticator.accessToken}`;
							resolve(error);
						}
					}
				}

				reject(error);
			});
		};

		const success = async (response: any) => {
			return new Promise((resolve, reject) => resolve(response));
		};

		httpClient.interceptResponse(success, error);
		setSettingupInterceptor(false);
	}, []);

	return (
		<HttpInterceptorContext.Provider value={{}}>
			{settingupInterceptor ? <></> : children}
		</HttpInterceptorContext.Provider>
	);
}

export const HttpInterceptorContext = createContext({});

export function useHttpInterceptor() {
	return useContext(HttpInterceptorContext);
}
