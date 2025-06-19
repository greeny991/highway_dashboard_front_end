'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { useDla } from '@/contexts/dla.context';
import { IMediaMetadata, IMedia } from '@/interfaces/media.interface';

type MediaProviderProps = {
	children: ReactNode;
};

type MediaContext = {
	fetch: (id: string) => Promise<IMedia>;
	save: (data: IMedia) => Promise<IMedia>;
	media: IMedia;
};

export function MediaProvider({ children }: MediaProviderProps) {
	const { MediaService } = useDla();
	const [media, setMedia] = useState<IMedia>({} as IMedia);

	function fetch(id: string): Promise<IMedia> {
		return new Promise<IMedia>((resolve, reject) => {
			MediaService.getById(id)
				.then((data: IMedia) => {
					data.metadata = data.metadata || ({} as IMediaMetadata);
					setMedia({ ...data });
					resolve({ ...data });
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	function save(data: IMedia): Promise<IMedia> {
		return new Promise<IMedia>((resolve, reject) => {
			MediaService.update(data)
				.then((data: IMedia) => {
					data.metadata = data.metadata || ({} as IMediaMetadata);
					setMedia({ ...data });
					resolve({ ...data });
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	return (
		<MediaContext.Provider
			value={{
				fetch,
				save,
				media
			}}
		>
			{children}
		</MediaContext.Provider>
	);
}

export const MediaContext = createContext({} as MediaContext);

export function useMedia() {
	return useContext(MediaContext);
}
