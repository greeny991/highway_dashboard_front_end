export enum Role {
	APIM = 'APIM',
	ADMIN = 'ADMIN',
	USER = 'USER'
}

export type User = {
	id: number;
	email: string;
	role: Role;
	companyId: number;
};

export type AuthUser = {
	accessToken: string;
	refreshToken: string;
	user: User;
};

export enum SHAREACCESSTYPE {
	ONLY_ADDED = 'ONLY_ADDED',
	ANYONE_WITH_LINK = 'ANYONE_WITH_LINK',
	COMPANY = 'COMPANY'
}

export enum SHAREPERMISSION {
	VIEW = 'VIEW',
	VIEW_AND_DOWNLOAD = 'VIEW_AND_DOWNLOAD'
}

export type ShareType = {
	id: string;
	mediaId: string;
	accessType: SHAREACCESSTYPE;
	permission: SHAREPERMISSION;
	emails: string[];
	expiresAt: string;
	maxViews: number;
	viewCount: number;
	createdAt: string;
	updatedAt: string;
};
