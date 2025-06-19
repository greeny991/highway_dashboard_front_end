import { PublicationType } from '@/config/publication-type.enum';
import { PublicationRating } from '@/interfaces/publication.interface';
import { IMedia } from './media.interface';

export interface IWatch extends IMedia {
	id: string;
	type: PublicationType;
	displayName: string;
	subHeader?: string;
	rating?: PublicationRating;
	companyLogo?: string;
	offering?: string;
	hash?: string;
	authentication: boolean;
	price: number;
	thumbnail?: string;
	views: number;
}

export interface IWatchPreview {
	id: string;
	type: PublicationType;
	displayName: string;
	subHeader?: string;
	rating?: PublicationRating;
	companyLogo?: string;
	offering?: string;
	hash?: string;
	authentication: boolean;
	price: number;
	thumbnail?: string;
	views: number;
}
