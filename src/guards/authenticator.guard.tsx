'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { Loader } from '@/components/loader/loader.component';
import { useDla } from '@/contexts/dla.context';
import { ICompany } from '@/interfaces/company.interface';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { IPackage } from '@/interfaces/package.interface';

export const AuthenticatorGuard = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const currentPath = usePathname();
	const { CompanyService } = useDla();
	const { authenticator } = useAuthenticator();
	const [showLoading, setShowLoading] = useState(true);
	const [showError, setShowError] = useState(false);
	const [company, setCompany] = useState<ICompany>();

	async function getCompany(): Promise<any> {
		if (company) return company;

		const companyId = authenticator.user.companyId as string;
		const userCompany = await CompanyService.getById(companyId);
		setCompany(userCompany);

		return userCompany;
	}

	async function handleStudioRouters(): Promise<boolean> {
		if (!authenticator.user) {
			router.push('/studio/signin', { scroll: false });
			return false;
		}

		if (authenticator.user && !authenticator.user.companyId) {
			router.push('/studio/signup/company', { scroll: false });
			return false;
		}

		const company = await getCompany();
		// TODO: Remove this once the package is implemented
		// const startedPackage = company.packages.find((pack: IPackage) => !pack.addon) ?? false;

		// if (!startedPackage) {
		// 	router.push('/studio/signup/package', { scroll: false });
		// 	return false;
		// }

		return true;
	}

	async function handleAccountRouters(): Promise<boolean> {
		if (!authenticator.user) {
			router.push('/', { scroll: false });
			return false;
		}

		return true;
	}

	useEffect(() => {
		const checkAccess = async () => {
			try {
				const isStudio = window.location.href.includes('/studio');
				const isAuthorized = isStudio ? await handleStudioRouters() : await handleAccountRouters();

				setShowError(false);
				setShowLoading(!isAuthorized);
			} catch (error) {
				setShowError(true);
				setShowLoading(false);
			}
		};
		checkAccess();
	}, [currentPath]);

	return (
		<>
			{showError && (
				<ErrorModelWidget
					isOpen={showError}
					handleAction={() => router.push('/', { scroll: false })}
					handleClose={() => router.push('/', { scroll: false })}
					action="Try again later"
					description="Sorry, there was an error trying to access your account."
				/>
			)}

			{showLoading && (
				<div className="fixed w-full h-full bg-gray-925 z-50 top-0">
					<Loader backdrop={false} />
				</div>
			)}

			{!showLoading && !showError && children}
		</>
	);
};
