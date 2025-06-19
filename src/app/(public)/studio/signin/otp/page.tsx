'use client';

import { Loader } from '@/components/loader/loader.component';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { useDla } from '@/contexts/dla.context';
import { useDto } from '@/contexts/dto.context';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { OtpWidget } from '@/widgets/otp.widget';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OtpPage() {
	const { data } = useDto();
	const { authenticator } = useAuthenticator();
	const [showError, setShowError] = useState(false);
	const router = useRouter();

	function createUser() {
		router.push('/studio/media-catalogue', { scroll: false });
	}

	useEffect(() => {
		if (!data || !data.email) {
			router.push('/studio/signin', { scroll: false });
		}
	}, []);

	return (
		<>
			{data && data.email && (
				<>
					<OtpWidget emit={() => createUser()} />
					{showError && (
						<ErrorModelWidget
							isOpen={showError}
							handleAction={() => router.push('/signin', { scroll: false })}
							handleClose={() => router.push('/signin', { scroll: false })}
							action="Try again later"
							description="Sorry, there was an error creating your account."
						/>
					)}
				</>
			)}
			{(!data || !data.email) && (
				<div className="relative flex flex-col h-[610px] w-[90%] md:w-[90%] md:max-w-[348px] lg:w-[75%] lg:max-w-[520px] bg-gray-800 p-9 rounded-[8px] justify-center items-center">
					<Loader />
				</div>
			)}
		</>
	);
}
