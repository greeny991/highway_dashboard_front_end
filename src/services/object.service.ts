'use client';

import Service from '@/services/service';
import { ICreateObject, IFinalizeObject, IObject } from '@/interfaces/object.interface';

export default class ObjectService extends Service {
	private apiVersion = 'v1';
	private domain = 'objects';

	async create(data: ICreateObject): Promise<IObject> {
		return this.post(`${this.apiVersion}/${this.domain}`, data);
	}

	async finalize(params: { id: string; data: IFinalizeObject }): Promise<any> {
		return this.post(`${this.apiVersion}/${this.domain}/${params.id}/finalize`, params.data);
	}
}
