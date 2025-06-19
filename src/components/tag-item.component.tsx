'use client';

interface Props {
	value: string;
	isGenre?: boolean;
}

export function TagItem(props: Props) {
	return (
		<div
			className={`${props.isGenre ? 'h-[30px] bg-gray-600 text-white-100 text-[10px] leading-[15px] font-extrabold' : 'h-[30px] bg-gray-150 text-gray-950 text-[12px] leading-[18px] font-semibold'} tracking-[0.12px] font-primary flex items-center rounded-[8px] `}
		>
			<span className="px-4 block uppercase">{props.value}</span>
		</div>
	);
}
