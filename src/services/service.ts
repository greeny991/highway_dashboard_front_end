'use client';

import { Authenticator } from '@/contexts/authenticator/authenticator.interface';
import { HttpClient } from '@/contexts/http-client/http-client.interface';

export default class Service {
	constructor(
		protected authenticator: Authenticator,
		private httpClient: HttpClient
	) {}

	protected get<T>(path: string) {
		return this.httpClient.get<T>(path, {
			withCredentials: true,
			headers: {
				Authorization: `Bearer ${this.authenticator.accessToken}`
			}
		});
	}

	protected async post<T, U>(path: string, data: T): Promise<U> {
		return this.httpClient.post(path, data, {
			withCredentials: true,
			headers: { Authorization: `Bearer ${this.authenticator.accessToken}` }
		});
	}

	protected async put<T, U>(path: string, data: T): Promise<U> {
		return this.httpClient.put(path, data, {
			withCredentials: true,
			headers: { Authorization: `Bearer ${this.authenticator.accessToken}` }
		});
	}

	protected async patch<T, U>(path: string, data: T): Promise<U> {
		return this.httpClient.patch(path, data, {
			withCredentials: true,
			headers: { Authorization: `Bearer ${this.authenticator.accessToken}` }
		});
	}

	protected async delete<T, U>(path: string, data?: T): Promise<U> {
		return this.httpClient.delete(path, data, {
			withCredentials: true,
			headers: { Authorization: `Bearer ${this.authenticator.accessToken}` }
		});
	}
}
