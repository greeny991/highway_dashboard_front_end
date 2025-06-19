'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { useDla } from '@/contexts/dla.context';
import { IPublication } from '@/interfaces/publication.interface';

type PublicationProviderProps = {
	children: ReactNode;
};

type PublicationContext = {
	fetch: (id: string) => Promise<IPublication>;
	publication: IPublication;
};

export function PublicationProvider({ children }: PublicationProviderProps) {
	const { PublicationService } = useDla();
	const [publication, setPublication] = useState<IPublication>({} as IPublication);

	function fetch(id: string): Promise<IPublication> {
		return new Promise<IPublication>((resolve, reject) => {
			PublicationService.getById(id)
				.then((data: IPublication) => {
					setPublication({ ...data });
					resolve({ ...data });
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	return (
		<PublicationContext.Provider
			value={{
				fetch,
				publication
			}}
		>
			{children}
		</PublicationContext.Provider>
	);
}

export const PublicationContext = createContext({} as PublicationContext);

export function usePublication() {
	return useContext(PublicationContext);
}
