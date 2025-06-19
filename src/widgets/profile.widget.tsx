'use client';

import { useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Dropdown } from '@/components/dropdown/dropdown.component';
import { LogoutWidget } from '@/widgets/logout.widget';
import { ProfileSettingsWidget } from '@/widgets/profile-settings.widget';
import { Avatar } from '@/components/avatar.component';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';

export function ProfileWidget({ emit }: any) {
	const router = useRouter();
	const currentPath = usePathname();
	const { authenticator } = useAuthenticator();
	const [showDropdownOptions, setShowDropdownOptions] = useState(false);
	const [profileSettingsModal, setProfileSettingsModal] = useState(false);
	const [logoutModal, setLogoutModal] = useState(false);
	const dropdownTrigger = useRef<any>(null);

	return (
		<>
			{authenticator.user && (
				<div className="relative">
					<div className="cursor-pointer" ref={dropdownTrigger}>
						<Avatar />
					</div>
					<Dropdown
						trigger={dropdownTrigger}
						position="right-0 top-[70px]"
						changeState={(isOpened) => setShowDropdownOptions(isOpened)}
						items={[
							{
								name: 'Profile Settings',
								asset: 'profile',
								click: () => setProfileSettingsModal(true)
							},
							{
								name: 'Company Management',
								asset: 'briefcase-logo',
								hidden: !!!authenticator.user.companyId,
								click: () => router.push('/studio/company/profile', { scroll: false })
							},
							{
								name: 'Package Purchases',
								asset: 'money',
								hidden: !!!authenticator.user.companyId,
								click: () => router.push('/studio/package-purchases', { scroll: false })
							},
							{
								name: 'Media Purchases',
								asset: 'money',
								click: () => router.push('/account/media-purchases', { scroll: false })
							},
							{
								name: 'Hiway Home',
								asset: 'house',
								hidden: !currentPath.includes('/studio'),
								click: () => router.push('/', { scroll: false })
							},
							{
								name: 'Hiway Studio',
								asset: 'house',
								hidden: currentPath.includes('/studio'),
								click: () => router.push('/studio/media-catalogue', { scroll: false })
							},
							{
								name: 'Log Out',
								asset: 'logout',
								divider: true,
								danger: true,
								click: () => setLogoutModal(true)
							}
						]}
					/>
					<LogoutWidget
						isOpen={logoutModal}
						handleClose={() => setLogoutModal(false)}
					></LogoutWidget>
					<ProfileSettingsWidget
						isOpen={profileSettingsModal}
						handleClose={() => setProfileSettingsModal(false)}
					></ProfileSettingsWidget>
				</div>
			)}
		</>
	);
}
