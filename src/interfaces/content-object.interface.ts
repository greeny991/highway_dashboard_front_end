interface IContentFabricObject {
	id: string;
	writeToken: string;
	node: string;
	authorizationToken: string;
	libraryId: string;
}

export interface IContentObject {
	id: string;
	contentFabricObject: IContentFabricObject;
}
