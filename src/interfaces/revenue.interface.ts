export interface IRevenue {
	id?: string;
	userId: string;
	companyId: string;
	publicationId: string;
	publicationThumbnail: string;
	publicationName: string;
	quantity: number;
	price: number;
	revenue: number;
}
