'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type DtoProviderProps = {
	children: ReactNode;
};

type DtoContext<T> = {
	setData: (data: T) => void;
	data: T;
};

export function DtoProvider<T>({ children }: DtoProviderProps) {
	const [data, setData] = useState();

	return (
		<DtoContext.Provider
			value={{
				setData,
				data
			}}
		>
			{children}
		</DtoContext.Provider>
	);
}

export const DtoContext = createContext({} as DtoContext<any>);

export function useDto() {
	return useContext(DtoContext);
}
