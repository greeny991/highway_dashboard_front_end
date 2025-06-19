'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { useHttpClient } from '@/contexts/http-client/http-client.context';
import CompanyService from '@/services/company.service';
import MediaService from '@/services/media.service';
import UserService from '@/services/user.service';
import PublicationService from '@/services/publication.service';
import ContentFabricService from '@/services/conten-fabric.service';
import WatchService from '@/services/watch.service';
import ObjectService from '@/services/object.service';
import AudienceService from '@/services/audience.service';
import PackageService from '@/services/package.service';

type DlaProviderProps = {
	children: ReactNode;
};

type DlaContext = {
	UserService: UserService;
	MediaService: MediaService;
	CompanyService: CompanyService;
	PublicationService: PublicationService;
	WatchService: WatchService;
	ContentFabricService: ContentFabricService;
	ObjectService: ObjectService;
	AudienceService: AudienceService;
	PackageService: PackageService;
};

export function DlaProvider({ children }: DlaProviderProps) {
	const { authenticator } = useAuthenticator();
	const { httpClient } = useHttpClient();
	const [user, setUser] = useState<UserService>(new UserService(authenticator, httpClient));
	const [media, setMedia] = useState<MediaService>(new MediaService(authenticator, httpClient));
	const [company, setCompany] = useState<CompanyService>(
		new CompanyService(authenticator, httpClient)
	);
	const [publication, setPublication] = useState<PublicationService>(
		new PublicationService(authenticator, httpClient)
	);
	const [watch, setWatch] = useState<WatchService>(new WatchService(authenticator, httpClient));
	const [contentFabric, setContentFabric] = useState<ContentFabricService>(
		new ContentFabricService()
	);
	const [object, setObject] = useState<ObjectService>(new ObjectService(authenticator, httpClient));
	const [audience, setAudience] = useState<AudienceService>(
		new AudienceService(authenticator, httpClient)
	);
	const [pack, setPack] = useState<PackageService>(new PackageService(authenticator, httpClient));

	return (
		<DlaContext.Provider
			value={{
				UserService: user,
				MediaService: media,
				CompanyService: company,
				PublicationService: publication,
				WatchService: watch,
				ContentFabricService: contentFabric,
				ObjectService: object,
				AudienceService: audience,
				PackageService: pack
			}}
		>
			{children}
		</DlaContext.Provider>
	);
}

export const DlaContext = createContext({} as DlaContext);

export function useDla() {
	return useContext(DlaContext);
}
