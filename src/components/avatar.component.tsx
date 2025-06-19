/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { useEffect, useState } from 'react';

export function Avatar() {
	const { authenticator } = useAuthenticator();
	const [userName, setUserName] = useState('');

	useEffect(() => {
		if (authenticator.user && (authenticator.user.email || authenticator.user.username)) {
			const name = authenticator.user.username
				? authenticator.user.username.slice(0, 2)
				: (authenticator.user.email as string).slice(0, 2);
			setUserName(name);
		}
	}, [authenticator.user]);

	return (
		<div className="w-[50px] h-[50px] rounded-[8px] flex justify-center items-center bg-gray-460 text-white-100 uppercase tracking-widest">
			{userName}
		</div>
	);
}
