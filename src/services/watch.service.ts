'use client';

import Service from '@/services/service';
import { IWatch } from '@/interfaces/watch.interface';

export default class WatchService extends Service {
	private apiVersion = 'v1';
	private domain = 'media/watch';

	async getById(id: string, publicationId?: string): Promise<IWatch> {
		const url = publicationId
			? `${this.apiVersion}/${this.domain}/${id}/${publicationId}`
			: `${this.apiVersion}/${this.domain}/${id}`;
		return this.get(url);
	}

	async createAccessTokenByPublicationId(id: string): Promise<{ token: string }> {
		return this.post(`${this.apiVersion}/${this.domain}/${id}/tokens`, {});
	}

	async createView(
		publicationId: string,
		data: { device?: string; country?: string; source?: string }
	): Promise<{ id: string }> {
		return this.post(`${this.apiVersion}/${this.domain}/${publicationId}/views`, data);
	}

	async updateViewDuration(viewId: string, viewDuration: number): Promise<void> {
		return this.patch(`${this.apiVersion}/${this.domain}/views/${viewId}`, { viewDuration });
	}
}
