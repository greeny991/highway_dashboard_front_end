'use client';

import { IPaginationResult } from '@/interfaces/pagination.interface';
import { IPublicationPurchase } from '@/interfaces/publication-purchase.interface';
import { IUser } from '@/interfaces/user.interface';
import Service from '@/services/service';

export default class UserService extends Service {
	private apiVersion = 'v1';
	private domain = 'users';

	async create(data: { email: string; type: string }): Promise<IUser> {
		return this.post(`${this.apiVersion}/${this.domain}`, data);
	}

	async getPublicationsPurchases(params: {
		id: string;
		perPage: number;
		continuationToken?: string;
	}): Promise<IPaginationResult<IPublicationPurchase>> {
		return this.get(
			`${this.apiVersion}/${this.domain}/${params.id}/purchases?perPage=${params.perPage}${params.continuationToken ? '&continuationToken=' + params.continuationToken : ''}`
		);
	}
}
