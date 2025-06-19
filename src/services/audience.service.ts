'use client';

import { IAudience } from '@/interfaces/audience.interface';
import { IPaginationResult } from '@/interfaces/pagination.interface';
import Service from '@/services/service';

export default class AudienceService extends Service {
	private apiVersion = 'v1';
	private domain = 'audiences';

	async findByCompanyId(params: {
		companyId: string;
		perPage: number;
		continuationToken?: string;
		genreFilter?: string;
		contentTypeFilter?: string;
		sortBy?: string;
	}): Promise<IPaginationResult<IAudience>> {
		const uri =
			`${this.apiVersion}/${this.domain}?` +
			`perPage=${params.perPage}` +
			`${params.continuationToken ? '&continuationToken=' + params.continuationToken : ''}` +
			`${params.genreFilter ? '&genreFilter=' + params.genreFilter : ''}` +
			`${params.contentTypeFilter ? '&contentTypeFilter=' + params.contentTypeFilter : ''}` +
			`${params.sortBy ? '&sortBy=' + params.sortBy : ''}`;

		return this.get(uri);
	}
}
