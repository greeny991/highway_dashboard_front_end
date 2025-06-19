'use client';

import Service from '@/services/service';
import { IPublication } from '@/interfaces/publication.interface';
import { PublicationType } from '@/config/publication-type.enum';
import { IPaginationResult } from '@/interfaces/pagination.interface';
import { IPublicationAnalytics } from '@/interfaces/publication-analytics.interface';

interface ICreatePublication {
	mediaId: string;
	type: PublicationType;
	displayName: string;
	subHeader?: string;
	rating?: string;
	autoPlay: boolean;
	segmentStart?: string;
	segmentEnd?: string;
	showCompanyLogoDuringVideo: boolean;
	companyLogo?: string;
	thumbnail: string;
}

export default class PublicationService extends Service {
	private apiVersion = 'v1';
	private domain = 'publications';

	async create(data: ICreatePublication): Promise<IPublication> {
		return this.post(`${this.apiVersion}/${this.domain}`, data);
	}

	async getById(id: string): Promise<IPublication> {
		return this.get(`${this.apiVersion}/${this.domain}/${id}`);
	}

	async getAll(params: {
		perPage: number;
		continuationToken?: string;
	}): Promise<IPaginationResult<IPublication>> {
		return this.get(
			`${this.apiVersion}/${this.domain}?perPage=${params.perPage}${params.continuationToken ? '&continuationToken=' + params.continuationToken : ''}`
		);
	}

	async getAnalyticsByPublicationId(id: string): Promise<IPublicationAnalytics> {
		return this.get(`${this.apiVersion}/${this.domain}/${id}/analytics`);
	}

	async createCheckoutLink(publicationId: string): Promise<{ url: string }> {
		return this.post(`${this.apiVersion}/${this.domain}/${publicationId}/checkout`, {});
	}

	async checkCheckoutPayment(sid: string): Promise<{ token: string }> {
		return this.get(`${this.apiVersion}/${this.domain}/checkout/${sid}`);
	}
}
