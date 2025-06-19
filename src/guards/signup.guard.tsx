'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { Loader } from '@/components/loader/loader.component';
import { useDto } from '@/contexts/dto.context';
import { ICompany } from '@/interfaces/company.interface';
import { useDla } from '@/contexts/dla.context';
import { IPackage } from '@/interfaces/package.interface';

export const SignupGuard = ({ children }: any) => {
	const pathname = usePathname();
	const router = useRouter();
	const { data } = useDto();
	const { CompanyService } = useDla();
	const { authenticator } = useAuthenticator();
	const [showError, setShowError] = useState(false);
	const [showLoading, setShowLoading] = useState(true);
	const [company, setCompany] = useState<ICompany>();

	async function getCompany(): Promise<any> {
		if (company) return company;

		const companyId = authenticator.user.companyId as string;
		const userCompany = await CompanyService.getById(companyId);
		setCompany(userCompany);

		return userCompany;
	}

	useEffect(() => {
		const checkAccess = async () => {
			setShowLoading(true);

			if (!authenticator.user) {
				router.push('/studio/signin', { scroll: false });
				return;
			}

			if (pathname === '/studio/signup' && authenticator.user) {
				router.push('/studio/signup/company', { scroll: false });
				return;
			}

			if (pathname === '/studio/signup/company' && authenticator.user.companyId) {
				router.push('/studio/signup/package', { scroll: false });
				return;
			}

			if (pathname === '/studio/signup/otp' && (!data || !data.email)) {
				router.push('/studio/signup', { scroll: false });
				return;
			}

			if (
				(pathname === '/studio/signup/package' || pathname === '/studio/signup/stripe') &&
				!authenticator.user.companyId
			) {
				router.push('/studio/signup/company', { scroll: false });
				return;
			}

			if (pathname === '/studio/signup/company' && !authenticator.user.companyId) {
				setShowLoading(false);
				return;
			}

			try {
				const company = await getCompany();
				const startedPackage = company.packages.find((pack: IPackage) => !pack.addon) ?? false;

				if (pathname === '/studio/signup/package' && startedPackage) {
					router.push('/studio/signup/stripe', { scroll: false });
					return;
				}

				if (pathname === '/studio/signup/stripe' && !startedPackage) {
					router.push('/studio/signup/package', { scroll: false });
					return;
				}

				if (pathname === '/studio/signup/stripe' && company.stripeOnboarding) {
					router.push('/studio/media-catalogue', { scroll: false });
					return;
				}

				setShowLoading(false);
			} catch (error) {
				setShowError(true);
			}
		};
		checkAccess();
	}, [pathname]);

	return (
		<>
			{showError && (
				<ErrorModelWidget
					isOpen={showError}
					handleAction={() => router.push('/', { scroll: false })}
					handleClose={() => router.push('/', { scroll: false })}
					action="Try again later"
					description="Sorry, an unexpected error has occurred."
				/>
			)}

			{showLoading && (
				<div className="absolute w-full h-full">
					<Loader backdrop={false} />
				</div>
			)}

			{!showError && !showLoading && children}
		</>
	);
};
