'use client';

import { useState } from 'react';
import BaseModel from '@/components/base-model.component';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { useDla } from '@/contexts/dla.context';
import { Loader } from '@/components/loader/loader.component';

interface Props {
	isOpen: boolean;
	handleClose: () => void;
}

export function LogoutWidget(props: Props) {
	const [signoutInProgress, setSignoutInProgress] = useState(false);
	const { authenticator } = useAuthenticator();

	async function signout(): Promise<void> {
		setSignoutInProgress(true);
		await authenticator.signout();
		window.location.replace('/');
	}

	return (
		<BaseModel
			isOpen={props.isOpen}
			handleClose={props.handleClose}
			handleOutsideClick={() => {
				props.handleClose;
			}}
		>
			<div className="relative w-2/6 h-fit max-w-[580px] xl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] gap-6 p-12">
				{signoutInProgress && <Loader />}
				<div className="flex flex-row justify-between w-full items-center">
					<div className={`flex flex-row items-center`}>
						<Icon name="logout" className="mr-[8px] fill-white-100 " size="smedium" />
						<label className="block m-2 font-primary   text-[16px] text-white-100 font-normal uppercase overflow-hidden">
							<span className="line-clamp-2">Log Out</span>
						</label>
					</div>
					<Icon
						name="close"
						size="medium"
						className="p-[4px] fill-gray-200 hover:fill-green-200 hover:cursor-pointer"
						onClick={props.handleClose}
					/>
				</div>
				<p className="font-primary   text-[16px] text-white-100 font-normal uppercase text-center">
					Are you sure you want to log out?
				</p>
				<hr className="w-full h-px bg-white-10 border-0 rounded" />
				<Button type="primary" fluid onClick={signout}>
					Continue
				</Button>
				<Button type="secondary" fluid onClick={props.handleClose}>
					Cancel
				</Button>
			</div>
		</BaseModel>
	);
}
