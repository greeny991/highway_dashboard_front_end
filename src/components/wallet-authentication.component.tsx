'use client';

import { Icon } from './icon/icon.component';

interface Props {
	label?: string;
	isWalletInstalled?: boolean;
}

export function WalletAuthentication(props: Props) {
	return (
		<div
			className={`flex flex-row justify-between h-[60px] bg-gray-900 rounded-lg w-full p-2.5 items-center`}
		>
			<div className="flex flex-row items-center">
				<div className="h-[48px] w-[48px] flex justify-center items-center">
					{props.label == 'Metamask' ? (
						<Icon name="metamask" size="large" />
					) : (
						<Icon name="coinbase" size="large" />
					)}
				</div>
				<label className="block m-2 text-[14px] font-normal text-white-100 dark:text-white overflow-hidden">
					<span className="line-clamp-2">{props.label}</span>
				</label>
			</div>
			<div className="group flex flex-row items-center">
				<a className=" text-white-80 group-hover:text-white-100 block text-[14px] font-normal cursor-pointer">
					{props.isWalletInstalled ? 'Installed' : 'Download'}
				</a>
				{!props.isWalletInstalled && (
					<div className="pl-1 fill-white-80 group-hover:fill-white-100">
						<Icon name="link" />
					</div>
				)}
			</div>
		</div>
	);
}
