'use client';

import { useState } from 'react';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { ICompany } from '@/interfaces/company.interface';
import { useDla } from '@/contexts/dla.context';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { InlineLoader } from '@/components/inline-loader/inline-loader.component';

interface Props {
	company: ICompany;
	hiddenLabel?: boolean;
}

export function StripeConnect({ company, hiddenLabel }: Props) {
	const { authenticator } = useAuthenticator();
	const { CompanyService } = useDla();
	const [showError, setShowError] = useState(false);
	const [loading, setLoading] = useState(false);

	function redirectToStripeSignin() {
		setLoading(true);
		CompanyService.createSigninLink(company.id)
			.then((data: { url: string }) => {
				window.open(data.url, '_blank');
			})
			.catch(() => setShowError(true))
			.finally(() => setLoading(false));
	}

	function redirectToStripeOnboarding() {
		setLoading(true);
		CompanyService.createOnboardingLink(company.id)
			.then((data: { url: string }) => {
				window.open(data.url, '_blank');
			})
			.catch(() => setShowError(true))
			.finally(() => setLoading(false));
	}

	return (
		<>
			<div className="w-full">
				{!hiddenLabel && (
					<label className="block mb-2 font-primary text-[10px] font-light uppercase text-white-60">
						Stripe account
					</label>
				)}
				<div className="flex flex-row justify-between h-[72px] bg-gray-900 rounded-lg w-full p-2.5 items-center">
					<div className="flex flex-row items-center">
						<div className="h-[48px] w-[48px]">
							<div
								className={`${company.stripeOnboarding ? '' : 'opacity-30'} flex justify-center items-center overflow-hidden h-full w-full`}
							>
								<Icon name="stripe" color="fill-white-100" size="medium-large" />
							</div>
						</div>
						{company.stripeOnboarding && (
							<label className="block mx-2 font-primary text-[13px] font-medium uppercase text-white-100 dark:text-white overflow-hidden">
								{authenticator.user.email}
							</label>
						)}
						{!company.stripeOnboarding && (
							<label className="block mx-2 font-primary text-[13px] font-medium uppercase text-gray-462 dark:text-white overflow-hidden">
								no stripe account connected
							</label>
						)}
					</div>

					{company.stripeOnboarding && (
						<Button
							type="primary"
							className="min-w-[118px] bg-green-600 text-white-100"
							onClick={() => redirectToStripeSignin()}
							disabled={loading}
						>
							{loading && <InlineLoader size="small" />}
							{!loading && <>Go to Stripe</>}
						</Button>
					)}

					{!company.stripeOnboarding && (
						<Button
							type="primary"
							className="min-w-[118px] bg-green-600 text-white-100"
							onClick={() => redirectToStripeOnboarding()}
							disabled={loading}
						>
							{loading && <InlineLoader size="small" />}
							{!loading && <>Connect Stripe</>}
						</Button>
					)}
				</div>
			</div>

			{showError && (
				<ErrorModelWidget
					isOpen={showError}
					handleAction={() => setShowError(false)}
					handleClose={() => setShowError(false)}
					action="Try again later"
					description="Sorry, there was an unexpected error."
				/>
			)}
		</>
	);
}
