'use client';

import { Avatar } from './avatar.component';
import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';

interface Props {
	label: string;
	scr: string;
	title: string;
	subtitle?: string;
	buttonTitle?: string;
	error?: string;
	click?: () => void;
}

export function ChangeField(props: Props) {
	return (
		<div className="w-full">
			<label className="block mb-2 font-primary text-[8px] font-extralight uppercase text-white-100 dark:text-white">
				{props.label}
			</label>
			<div
				className={`${props.error && 'border border-red-200'} flex flex-row justify-between h-[72px] bg-gray-900 rounded-lg w-full p-2.5 items-center`}
			>
				<div className="flex flex-row items-center min-w-0">
					<div className="h-[48px] w-[48px] flex-shrink-0">
						<div className="flex justify-center items-center overflow-hidden h-full w-full">
							<Icon name={props.scr} color="fill-white-100" size="medium-large" />
						</div>
					</div>
					<div className="min-w-0 flex-grow overflow-hidden mx-2">
						<label className="block text-[10px] font-normal uppercase text-white-100 dark:text-white truncate">
							{props.title}
						</label>
						{props.subtitle && (
							<label className="block text-[8px] font-extralight uppercase text-white-100 dark:text-white truncate">
								{props.subtitle}
							</label>
						)}
					</div>
				</div>
				<div className="flex-shrink-0 ml-2">
					{props.click && (
						<Button type="secondary" onClick={props.click}>
							{props.buttonTitle ?? 'Change'}
						</Button>
					)}
				</div>
			</div>
			{props.error && (
				<label
					typeof="error"
					className="block mt-2 text-[8px] font-extralight text-red-200 dark:text-white"
				>
					{props.error}
				</label>
			)}
		</div>
	);
}
