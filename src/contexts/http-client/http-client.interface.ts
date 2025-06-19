'use client';

export interface HttpClient {
	get<T>(path: string, headers: any): Promise<T>;
	post<T, U>(path: string, data: T, headers: any): Promise<U>;
	put<T, U>(path: string, data: T, headers: any): Promise<U>;
	patch<T, U>(path: string, data: T, headers: any): Promise<U>;
	delete<T, U>(path: string, data: T, headers: any): Promise<U>;
	interceptResponse(
		handleSuccess: (response: any) => Promise<any>,
		handleError: (error: any) => Promise<any>
	): void;
}
