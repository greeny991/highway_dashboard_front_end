'use client';

import LogoutButton from '@/components/logout-button';

export default function CompanyPackageLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<LogoutButton />
		</>
	);
}
