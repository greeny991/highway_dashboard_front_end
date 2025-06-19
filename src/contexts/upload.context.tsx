'use client';

import { createContext, ReactNode, useContext } from 'react';
import { useDla } from '@/contexts/dla.context';
import { ICreateObject } from '@/interfaces/object.interface';
import { IContentFabricFile } from '@/interfaces/content-fabric.interface';
import { getPresignedUrl } from '@/lib/api';

interface IUploadFile extends IContentFabricFile {
	name: string;
}

type UploadProviderProps = {
	children: ReactNode;
};

type UploadContext = {
	save: (params: {
		data: ICreateObject;
		asset: string;
		files: IUploadFile[];
	}) => Promise<{ index: number; assets: any }>;
	uploadS3: (file: File) => Promise<string | null>;
};

export function UploadProvider({ children }: UploadProviderProps) {
	const { ContentFabricService, ObjectService } = useDla();

	async function save(params: {
		data: ICreateObject;
		asset: string;
		files: IUploadFile[];
	}): Promise<{ index: number; assets: any }> {
		const object = await ObjectService.create(params.data);

		await ContentFabricService.createInstance({
			node: object.node,
			token: object.authorizationToken
		});

		await ContentFabricService.upload({
			files: params.files,
			objectId: object.id,
			libraryId: object.libraryId,
			writeToken: object.writeToken
		});

		const assets = await ObjectService.finalize({
			id: object.id,
			data: {
				...params.data,
				libraryId: object.libraryId,
				node: object.node,
				writeToken: object.writeToken,
				asset: params.asset,
				files: params.files.map((file) => file.name)
			}
		});

		const index: number =
			Object.keys(assets)
				.map((key) => Number(key))
				.filter((key) => !isNaN(Number(key)))
				.sort((a, b) => a - b)
				.pop() || 1;

		return { index, assets };
	}

	async function uploadS3(file: File): Promise<string | null> {
		const res = await getPresignedUrl({ filename: file.name, type: file.type });
		if (res.data) {
			const uploadRes = await fetch(res.data.uploadUrl, {
				method: 'PUT',
				body: file,
				headers: {
					'Content-Type': file.type
				}
			});
			if (uploadRes.ok) {
				return res.data.fileUrl;
			}
		}
		return null;
	}

	return (
		<UploadContext.Provider
			value={{
				save,
				uploadS3
			}}
		>
			{children}
		</UploadContext.Provider>
	);
}

export const UploadContext = createContext({} as UploadContext);

export function useUpload() {
	return useContext(UploadContext);
}
