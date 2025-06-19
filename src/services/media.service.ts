'use client';

import { IContentObject } from '@/interfaces/content-object.interface';
import { IMediaAnalytics } from '@/interfaces/media-analytics.interface';
import { IMedia } from '@/interfaces/media.interface';
import { IPaginationResult } from '@/interfaces/pagination.interface';
import { PresignedUrlResponse } from '@/interfaces/presigned-url-response.interface';
import Service from '@/services/service';

export default class MediaService extends Service {
	private apiVersion = 'v1';
	private domain = 'media';

	async create(name: string): Promise<IContentObject> {
		return this.post(`${this.apiVersion}/${this.domain}`, {
			companyId: this.authenticator.user.companyId,
			name
		});
	}

	async update(data: IMedia): Promise<IMedia> {
		return this.put(`${this.apiVersion}/${this.domain}/${data.id}`, data);
	}

	async finalize(id: string): Promise<{ hash: string }> {
		return this.post(`${this.apiVersion}/${this.domain}/${id}/finalize`, {});
	}

	async getById(id: string): Promise<IMedia> {
		return this.get(`${this.apiVersion}/${this.domain}/${id}`);
	}

	async deleteById(id: string): Promise<void> {
		return this.delete(`${this.apiVersion}/${this.domain}/${id}`);
	}

	async getByStatus(params: {
		status: string[];
		perPage: number;
	}): Promise<IPaginationResult<IMedia>> {
		return this.get(
			`${this.apiVersion}/${this.domain}?status=${params.status.join(',')}&perPage=${params.perPage}`
		);
	}

	async getAllThumbnails(id: string): Promise<any> {
		return this.get(`${this.apiVersion}/${this.domain}/${id}/thumbnails`);
	}

	async getAnalyticsByMediaId(params: { id: string; companyId: string }): Promise<IMediaAnalytics> {
		return this.get(`${this.apiVersion}/${this.domain}/${params.id}/analytics`);
	}

	// Add a media thumbnail
	async addThumbnails(mediaId: string, data: { url: string; name?: string }[]): Promise<any> {
		return this.post(`${this.apiVersion}/${this.domain}/${mediaId}/thumbnails`, data);
	}

	// Delete a thumbnail
	async deleteThumbnail(thumbnailId: string): Promise<any> {
		return this.delete(`${this.apiVersion}/${this.domain}/thumbnails/${thumbnailId}`, {});
	}

	// Set a thumbnail as default
	async setDefaultThumbnail(thumbnailId: string): Promise<any> {
		return this.put(`${this.apiVersion}/${this.domain}/thumbnails/${thumbnailId}/default`, {});
	}
}
