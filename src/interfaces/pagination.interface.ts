export interface IPaginationResult<T> {
	continuationToken?: string;
	perPage: number;
	items: T[];
}
