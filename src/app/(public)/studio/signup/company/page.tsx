'use client';

import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { CreateCompanyWidget } from '@/widgets/create-company.widget';
import { ProfileWidget } from '@/widgets/profile.widget';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CreateCompanyPage() {
	const router = useRouter();
	const { authenticator } = useAuthenticator();

	useEffect(() => {
		if (authenticator?.user?.companyId) {
			router.push('/studio');
		}
	}, [authenticator?.user?.companyId]);

	return (
		<>
			<CreateCompanyWidget />
			<div className="absolute top-[11px] right-[24px]">
				<ProfileWidget />
			</div>
		</>
	);
}
