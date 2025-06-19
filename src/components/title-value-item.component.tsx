'use client';

interface Props {
	title?: string;
	value: string;
	truncate?: string;
	className?: string;
}

export function TitleValueItem(props: Props) {
	return (
		<div>
			{props.title && (
				<label
					className={`${props.className} block mx-2 text-[10px] pb-1 font-normal uppercase opacity-60 text-white-100 overflow-hidden`}
				>
					{props.title}
				</label>
			)}
			<label
				className={`${props.truncate ? 'truncate ' + props.truncate : ''} ${props.className} block mx-2 text-[14px] font-normal uppercase text-white-100 overflow-hidden`}
			>
				{props.value}
			</label>
		</div>
	);
}
