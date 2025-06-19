'use client';

interface Props {
	src: string;
	selected?: boolean;
}

export function ThumbnailItem(props: Props) {
	return (
		<div>
			<div
				className={`${props.selected ? 'border-[2px] border-yellow-900' : ''}
        group w-[266px] h-[157px] rounded-[8px] flex justify-center items-center overflow-hidden `}
			>
				<img src={props.src} className="w-full h-full object-cover rounded-[8px]" />
			</div>
		</div>
	);
}
