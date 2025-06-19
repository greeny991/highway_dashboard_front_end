'use client';

import { ICompany, ICompanyUpdateDto } from '@/interfaces/company.interface';
import { IPackagePurchase } from '@/interfaces/package-purchase.interface';
import { IPackage } from '@/interfaces/package.interface';
import { IPaginationResult } from '@/interfaces/pagination.interface';
import {
	ICompanyAnalytics,
	ICompanyAnalyticsFilters
} from '@/interfaces/company-analytics.interface';
import { IRevenue } from '@/interfaces/revenue.interface';
import Service from '@/services/service';

export default class CompanyService extends Service {
	private apiVersion = 'v1';
	private domain = 'companies';

	async create(data: { name: string; website: string }): Promise<ICompany> {
		return this.post(`${this.apiVersion}/${this.domain}`, data);
	}

	async update(data: Partial<ICompany> & { id: string }): Promise<ICompany> {
		return this.put(`${this.apiVersion}/${this.domain}`, data);
	}

	async getById(id: string): Promise<ICompany> {
		return this.get(`${this.apiVersion}/${this.domain}/${id}`);
	}

	async createOnboardingLink(id: string): Promise<{ url: string }> {
		return this.post(`${this.apiVersion}/${this.domain}/${id}/stripe/onboarding`, {});
	}

	async createSigninLink(id: string): Promise<{ url: string }> {
		return this.post(`${this.apiVersion}/${this.domain}/${id}/stripe/signin`, {});
	}

	async getPackagesPurchases(params: {
		id: string;
		perPage: number;
		continuationToken?: string;
	}): Promise<IPaginationResult<IPackagePurchase>> {
		return this.get(
			`${this.apiVersion}/${this.domain}/${params.id}/purchases?perPage=${params.perPage}${params.continuationToken ? '&continuationToken=' + params.continuationToken : ''}`
		);
	}

	async getPackages(id: string): Promise<IPackage[]> {
		return this.get(`${this.apiVersion}/${this.domain}/${id}/packages`);
	}

	async getAllPublic(): Promise<ICompany[]> {
		return this.get(`${this.apiVersion}/${this.domain}`);
	}

	async getAnalyticsByCompanyId(
		id: string,
		filters: ICompanyAnalyticsFilters
	): Promise<ICompanyAnalytics> {
		let queryParams = '';
		if (filters.startDate) {
			queryParams += `&startDate=${filters.startDate}`;
		}
		if (filters.endDate) {
			queryParams += `&endDate=${filters.endDate}`;
		}
		if (filters.contentType) {
			queryParams += `&contentType=${filters.contentType}`;
		}
		if (filters.source) {
			queryParams += `&source=${filters.source}`;
		}
		if (filters.device) {
			queryParams += `&device=${filters.device}`;
		}
		if (filters.country) {
			queryParams += `&country=${filters.country}`;
		}

		return this.get(
			`${this.apiVersion}/${this.domain}/${id}/publications/analytics?${queryParams}`
		);
	}

	async getRevenue(params: {
		id: string;
		perPage: number;
		continuationToken?: string;
	}): Promise<IPaginationResult<IRevenue>> {
		return this.get(
			`${this.apiVersion}/${this.domain}/${params.id}/revenues?perPage=${params.perPage}${params.continuationToken ? '&continuationToken=' + params.continuationToken : ''}`
		);
	}

	async summaryRevenue(params: {
		id: string;
		dateStart: number;
		dateEnd: number;
	}): Promise<{ revenue: number }> {
		return this.get(
			`${this.apiVersion}/${this.domain}/${params.id}/revenues/summary?dateStart=${params.dateStart}&dateEnd=${params.dateEnd}`
		);
	}
}
