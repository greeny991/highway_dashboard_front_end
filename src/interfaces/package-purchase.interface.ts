import { IPackage } from '@/interfaces/package.interface';

export interface IPackagePurchase {
	id?: string;
	companyId: string;
	stripeSubscriptionId: string;
	stripeInvoiceId?: string;
	stripePaymentIntentId?: string;
	dateStart: number;
	dateEnd: number;
	package: IPackage;
}
