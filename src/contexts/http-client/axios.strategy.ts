'use client';

import { HttpClient } from '@/contexts/http-client/http-client.interface';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export default class AxiosHttpClient implements HttpClient {
	private client!: AxiosInstance;

	constructor(baseURL: string) {
		this.createClient(baseURL);
	}

	private createClient(baseURL: string): void {
		this.client = axios.create({
			baseURL
		});
	}

	interceptResponse(handleSuccess: any, handleError: any): void {
		this.client.interceptors.response.use(
			(response) => handleSuccess(response),
			(error) => {
				return handleError(error).then((error: any) => this.client(error.config));
			}
		);
	}

	async get<T>(path: string, headers: AxiosRequestConfig): Promise<T> {
		return this.client.get<T>(path, headers).then((response: AxiosResponse<T>) => response.data);
	}

	async post<T, U>(path: string, data: T, headers: AxiosRequestConfig): Promise<U> {
		return this.client
			.post(path, data, headers)
			.then((response: AxiosResponse<U>) => response.data);
	}

	async put<T, U>(path: string, data: T, headers: AxiosRequestConfig): Promise<U> {
		return this.client.put(path, data, headers).then((response: AxiosResponse<U>) => response.data);
	}

	async patch<T, U>(path: string, data: T, headers: AxiosRequestConfig): Promise<U> {
		return this.client
			.patch(path, data, headers)
			.then((response: AxiosResponse<U>) => response.data);
	}

	async delete<T, U>(path: string, data: T, headers: AxiosRequestConfig): Promise<U> {
		return this.client
			.delete(path, { ...headers, data })
			.then((response: AxiosResponse<U>) => response.data);
	}
}
