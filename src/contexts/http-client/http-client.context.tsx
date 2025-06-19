'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { HttpClient } from '@/contexts/http-client/http-client.interface';
import AxiosHttpClient from '@/contexts/http-client/axios.strategy';

type HttpClientProviderProps = {
	children: ReactNode;
};

type HttpClientContext = {
	httpClient: HttpClient;
};

export function HttpClientProvider({ children }: HttpClientProviderProps) {
	const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL as string;
	const [client, setClient] = useState<HttpClient>(new AxiosHttpClient(baseURL));

	return (
		<HttpClientContext.Provider
			value={{
				httpClient: client
			}}
		>
			{children}
		</HttpClientContext.Provider>
	);
}

export const HttpClientContext = createContext({} as HttpClientContext);

export function useHttpClient() {
	return useContext(HttpClientContext);
}
