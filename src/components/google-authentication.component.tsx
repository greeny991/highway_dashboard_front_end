'use client';

import { Icon } from './icon/icon.component';

export function GoogleAuthentication() {
	return (
		<div className={`flex flex-row h-[60px] bg-gray-900 rounded-lg w-full p-2.5`}>
			<div className="h-[48px] w-[48px] flex justify-center items-center">
				<Icon name="google" size="large" />
			</div>
			<div className="flex flex-row items-center justify-center w-full">
				<label className="block m-2 text-[14px] font-normal text-gray-300 dark:text-white overflow-hidden">
					<span className="line-clamp-2">Enter with google account</span>
				</label>
			</div>
		</div>
	);
}
