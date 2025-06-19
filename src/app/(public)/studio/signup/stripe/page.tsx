'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/button.component';
import { BoxWidget } from '@/widgets/box.widget';
import { useDla } from '@/contexts/dla.context';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { Loader } from '@/components/loader/loader.component';
import LogoutButton from '@/components/logout-button';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';

export default function CompanyStripePage() {
	const { authenticator } = useAuthenticator();
	const { CompanyService } = useDla();
	const [showError, setShowError] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	function generateStripeLink() {
		setLoading(true);

		const companyId = authenticator.user.companyId as string;
		CompanyService.createOnboardingLink(companyId)
			.then((data: { url: string }) => {
				window.open(data.url, '_blank');
				router.push('/studio/media-catalogue', { scroll: false });
			})
			.catch(() => setShowError(true));
	}

	return (
		<>
			{showError && (
				<ErrorModelWidget
					isOpen={showError}
					handleAction={() => router.push('/studio/media-catalogue', { scroll: false })}
					handleClose={() => router.push('/studio/media-catalogue', { scroll: false })}
					action="Try again later"
					description="Sorry, there was an error creating your account."
				/>
			)}

			{loading && (
				<div className="relative w-full h-full">
					<Loader backdrop={false} />
				</div>
			)}

			{!loading && (
				<BoxWidget title="Stripe account">
					<div className="p-2" />
					<div className="text-white-100">
						A Stripe account is required to publish paid content and receive revenue from Hiway.
						Please follow the steps on the Stripe website and once it’s finished, you’ll be
						redirected to Hiway.
					</div>
					<div className="p-2" />
					<Button type="primary" fluid onClick={generateStripeLink}>
						Connect Stripe
					</Button>
					<div className="p-2" />
					<Button
						type="secondary"
						fluid
						onClick={() => router.push('/studio/media-catalogue', { scroll: false })}
					>
						Setup later
					</Button>
				</BoxWidget>
			)}

			<LogoutButton />
		</>
	);
}
