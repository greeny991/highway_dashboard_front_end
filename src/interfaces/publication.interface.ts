import { PublicationStatus } from '@/config/publication-status.enum';
import { PublicationType } from '@/config/publication-type.enum';
import { IMedia } from './media.interface';

export enum PublicationRating {
	UNIVERSAL = 'U',
	PARENTAL_GUIDANCE = 'PG',
	OVER_12A = '12A',
	OVER_12 = '12',
	OVER_15 = '15',
	OVER_18 = '18',
	OVER_18_RESTRICTION = 'R18'
}

export interface IPublication {
	id: string;
	companyId: string;
	userId: string;
	mediaId: string;
	status: PublicationStatus;
	type: PublicationType;
	displayName: string;
	subHeader?: string;
	rating?: PublicationRating;
	autoPlay: boolean;
	segmentStart?: number;
	segmentEnd?: number;
	showCompanyLogoDuringVideo: boolean;
	companyLogo?: string;
	createdAt: string;
	cfOffering: string;
	cfMezzanineHash: string;
	mediaName: string;
	signedToken?: string;
	thumbnail: string;
	price: number;
	authentication: boolean;
	media: IMedia;
	views?: number;
}
