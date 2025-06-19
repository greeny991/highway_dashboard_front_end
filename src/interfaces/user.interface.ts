import { IPackage } from '@/interfaces/package.interface';

export interface IUser {
	email?: string;
	username?: string;
	id?: string;
	companyId?: string;
	cfAddress?: string;
	role?: string;
	logins?: { did: string; type: string }[];
	image?: string;
}
