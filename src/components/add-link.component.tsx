'use client';

import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';
import { Toggle } from './toggle.component';

interface Props {
	label: string;
	iconName: string;
	value?: string;
	placeholder?: string;
	error?: string;
}

export function AddLink(props: Props) {
	return (
		<div className="w-full">
			<label className="block mb-2 font-primary text-[10px] font-light uppercase text-white-60">
				{props.label}
			</label>
			<div
				className={`${props.error ? 'border-red-200' : 'border-gray-460'} flex flex-row border justify-between h-[48px] bg-gray-900 rounded-lg w-full py-2.5 px-4 items-center`}
			>
				<div className="flex flex-row items-center w-full">
					<Icon name={props.iconName} color="fill-white-100" size="smedium" />
					<input
						className={`
            font-primary ml-4 outline-none focus:outline-none bg-gray-900 text-[13px] font-normal placeholder:font-light text-white-100 placeholder:text-white-60 block w-full
          `}
						placeholder={props.placeholder}
					/>
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
