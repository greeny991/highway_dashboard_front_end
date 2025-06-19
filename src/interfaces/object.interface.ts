export interface IObject {
	id: string;
	libraryId: string;
	node: string;
	writeToken: string;
	authorizationToken: string;
}

export interface ICreateObject {
	mediaId?: string;
	companyId?: string;
}

export interface IFinalizeObject {
	mediaId?: string;
	companyId?: string;
	libraryId: string;
	node: string;
	writeToken: string;
	asset: string;
	files: string[];
}
