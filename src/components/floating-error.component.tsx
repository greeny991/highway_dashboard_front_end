'use client';

import { Icon } from '@/components/icon/icon.component';
import { Button } from './button/button.component';

interface Props {
	message: string;
}

export function FloatingError(props: Props) {
	return (
		<div className="max-w-[348px] flex flex-col gap-2 p-1 rounded-[8px] bg-gray-800">
			<div className="flex flex-col gap-2">
				<div
					className={`flex flex-row justify-between h-[56px] rounded-lg w-full p-2.5 items-center bg-red-10 fill-red-200 text-red-200`}
				>
					<div className={`flex flex-row items-center`}>
						<Icon name="info" size="medium" />
						<label className="block m-2 text-[14px] font-light dark:text-white overflow-hidden">
							<span className="line-clamp-2">{props.message}</span>
						</label>
					</div>
					<div className="p-1" />
					<Button type="icon" iconColorType="icon-danger">
						<Icon name="close" size="medium" />
					</Button>
				</div>
			</div>
		</div>
	);
}
