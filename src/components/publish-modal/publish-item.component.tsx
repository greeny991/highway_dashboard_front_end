'use client';

import { Icon } from '@/components/icon/icon.component';

interface Props {
	title: string;
	subtitle: string;
	src: string;
	onClick: () => void;
}

export function PublishItem(props: Props) {
	return (
		<div className="group" onClick={props.onClick}>
			<div className="w-full flex flex-row items-center justify-between cursor-pointer bg-gray-900 group-hover:bg-green-600 p-4 rounded-lg">
				<div>
					<p className="font-primary font-normal text-[14px] text-white-100 ">{props.title}</p>
					<div className="py-[2px]" />
					<p className="font-primary font-light text-[12px] text-gray-150 ">{props.subtitle}</p>
				</div>
				<Icon
					name={props.src}
					size="medium"
					color="fill-white-100"
					className="bg-gray-910 group-hover:bg-green-200 group-hover:bg-opacity-10  p-4 rounded-lg"
				/>
			</div>
		</div>
	);
}
