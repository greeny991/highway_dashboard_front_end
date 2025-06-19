'use client';

import { IPackagePurchase } from '@/interfaces/package-purchase.interface';
import { IPackage } from '@/interfaces/package.interface';
import Service from '@/services/service';

export default class PackageService extends Service {
	private apiVersion = 'v1';
	private domain = 'packages';

	async getAll(): Promise<IPackage[]> {
		return this.get(`${this.apiVersion}/${this.domain}`);
	}

	async createCheckoutLink(parmas: {
		packageId: string;
		successUrl: string;
		cancelUrl: string;
	}): Promise<{ url: string }> {
		return this.post(`${this.apiVersion}/${this.domain}/${parmas.packageId}/checkout`, {
			successUrl: parmas.successUrl,
			cancelUrl: parmas.cancelUrl
		});
	}

	async checkCheckoutPayment(sid: string): Promise<IPackagePurchase> {
		return this.get(`${this.apiVersion}/${this.domain}/checkout/${sid}`);
	}
}
