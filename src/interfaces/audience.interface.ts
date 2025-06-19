import { IPublication } from '@/interfaces/publication.interface';

export interface IAudience {
	id?: string;
	userId: string;
	userEmail: string;
	companyId: string;
	companyUserId: string;
	dateJoined?: number;
	// dateFollowed?: number;
	totalPaid?: number;
	genresLiked?: string[];
	purchasedPublication?: IPublication[];
}
