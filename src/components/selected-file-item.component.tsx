'use client';

import { Button } from './button/button.component';
import { Icon } from './icon/icon.component';

interface Props {
	label: string;
	remove: () => void;
}

export function SelectedFileItem(props: Props) {
	return (
		<div className="flex flex-col">
			<div className="flex flex-row justify-between w-full items-center">
				<label className="block m-2 pl-2 text-[12px] text-white-100 font-light overflow-hidden">
					<span className="line-clamp-2">{props.label}</span>
				</label>
				<Button type="icon" iconColorType="icon-primary" square onClick={props.remove}>
					<Icon name="close" size="medium" className=" hover:fill-green-200" />
				</Button>
			</div>
			<hr className="w-full h-px bg-gray-800 border-0" />
		</div>
	);
}
