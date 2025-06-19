'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { SelectPackage } from '@/components/select-package.component';
import { BoxWidget } from '@/widgets/box.widget';
import { useDla } from '@/contexts/dla.context';
import { IPackage } from '@/interfaces/package.interface';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { Loader } from '@/components/loader/loader.component';
import { InlineLoader } from '@/components/inline-loader/inline-loader.component';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { AuthenticationModalWidget } from '@/widgets/authentication-modal.widget';

interface Props {
	cancel?: boolean;
	setIsRedirecting: (value: boolean) => void; // Function to update state in HomePage
}

export function HomePageWidget(props: Props) {
	const router = useRouter();
	const { PackageService } = useDla();
	const [starterPackage, setStarterPackage] = useState(true);
	const [showError, setShowError] = useState(false);
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [packages, setPackages] = useState<IPackage[]>([]);
	const [isRedirecting, setIsRedirecting] = useState(false);

	const { authenticator } = useAuthenticator();
	const [authenticationModal, setAuthenticationModal] = useState(false);
	const [loginUI, setLoginUI] = useState(false);

	useEffect(() => {
		PackageService.getAll()
			.then((data: IPackage[]) => {
				setFetchInProgress(false);
				setPackages(data);
			})
			.catch((error) => {
				setFetchInProgress(false);
				setShowError(true);
			});
	}, [PackageService]);

	function redirectUserToStudio() {
		if (authenticator.user) {
			setIsRedirecting(true); // Show loader
			if (authenticator.user.companyId) {
				router.replace('/studio/media-catalogue', { scroll: false });
			} else {
				router.replace('/studio/signup/company', { scroll: false });
			}
		} else {
			setIsRedirecting(true);
			router.push('/', { scroll: false });
		}
	}

	return (
		<>
			{showError && (
				<ErrorModelWidget
					isOpen={showError}
					handleAction={() => router.push('/studio', { scroll: false })}
					handleClose={() => router.push('/studio', { scroll: false })}
					action="Try again later"
					description="Sorry, there was an error creating your account."
				/>
			)}

			{fetchInProgress && (
				<div className="relative w-full h-full">
					<Loader backdrop={false} />
				</div>
			)}

			{!fetchInProgress && starterPackage && (
				<BoxWidget title="your starter package">
					<div className="font-primary text-[12px] font-light text-gray-200 uppercase">
						No contracts. No surprise fees.
					</div>
					{packages
						.filter((pack) => !pack.addon)
						.map((pack, index) => (
							<div className="w-full h-full" key={index}>
								<div className="p-2" />
								<div className="flex flex-col px-8 py-8 gap-4 border border-gray-460 rounded-[8px]">
									<div className="flex items-end gap-2">
										<div className="font-primary text-[40px] leading-[40px] text-green-200 font-medium uppercase">
											${pack.price}
										</div>
										<div className="font-primary text-[24px] leading-[28.13px] text-white-100 font-normal">
											/ month
										</div>
									</div>
									<div className="flex flex-col font-primary text-[12px] leading-[24px] text-white-100 font-normal uppercase">
										<div className="opacity-60">Storage</div>
										<div className="flex items-center gap-[10px]">
											<Icon name="tick-round" />
											{pack.storageInGb} GB Storage
										</div>
										<div className="flex items-center gap-[10px]">
											<Icon name="tick-round" />
											{pack.streamsInHours} Hrs Streams
										</div>
									</div>
									<div className="flex flex-col font-primary text-[12px] leading-[24px] text-white-100 font-normal uppercase">
										<div className="opacity-60">Storage</div>
										<div className="flex items-center gap-[10px]">
											<Icon name="tick-round" />
											{pack.account?.admin} Admin
										</div>
										<div className="flex items-center gap-[10px]">
											<Icon name="tick-round" />
											{pack.account?.teamMembers} Team Members
										</div>
									</div>

									<Button
										type="primary"
										fluid
										onClick={() => {
											setAuthenticationModal(true);
											setLoginUI(false);
										}}
									>
										Sign Up
									</Button>
									<hr />
									<div className="font-primary text-[12px] font-light text-gray-200 uppercase">
										Already have an account?
									</div>

									<Button
										bgColor="bg-green-600"
										fluid
										onClick={() => {
											setAuthenticationModal(true);
											setLoginUI(true);
										}}
									>
										Log in
									</Button>
								</div>
							</div>
						))}
					<div className="p-3" />
				</BoxWidget>
			)}

			{authenticationModal && (
				<AuthenticationModalWidget
					isOpen={authenticationModal}
					loginUI={loginUI}
					setIsRedirecting={props.setIsRedirecting} // Pass it here
					handleClose={(reload) => {
						setAuthenticationModal(false); // ✅ Ensure the modal actually closes
						if (reload) {
							props.setIsRedirecting(true); // ✅ Show loader
							setTimeout(redirectUserToStudio, 200); // ✅ Delay ensures UI updates before redirecting
						}
					}}
				/>
			)}
		</>
	);
}
