export interface IPublicationPurchase {
	id?: string;
	mediaId: string;
	companyId: string;
	publicationId: string;
	publicationThumbnail: string;
	publicationName: string;
	userId: string;
	stripePaymentIntentId?: string;
	price: number;
	dateStart: number;
	dateEnd: number;
	createdAt: number;
}
