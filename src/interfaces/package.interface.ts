export type PackagePaymentType = 'one-time' | 'recurring';

export interface IPackage {
	id: string;
	name: string;
	description: string;
	addon: boolean;
	price: number;
	paymentType: PackagePaymentType;
	storageInGb?: number;
	streamsInHours?: number;
	account?: {
		admin: number;
		teamMembers: number;
	};
}
