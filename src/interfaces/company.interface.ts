import { IPackage } from '@/interfaces/package.interface';
import { CompanyType } from '@/config/company-type.enum';

export interface ICompany {
	id: string;
	name: string;
	website: string;
	logo?: string;
	cfLibraryId: string;
	cfStaticsObjectId: string;
	stripeAccountId?: string;
	stripeOnboarding?: boolean;
	packages: IPackage[];
	isPublic: boolean;
	type?: CompanyType;
}

export interface ICompanyUpdateDto {
	id: string;
	name: string;
	website: string;
	cfLogo?: string;
	isPublic: boolean;
}
