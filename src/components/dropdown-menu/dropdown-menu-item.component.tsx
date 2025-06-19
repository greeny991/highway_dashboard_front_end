'use client';

interface Props {
	name: string;
	comingSoon?: boolean;
}

export function DropdownMenuItem(props: Props) {
	return (
		<div
			className={`text-gray-200 hover:text-white-100 block w-full h-[48px] px-[16px] py-2 cursor-pointer font-light text-[12px] rounded-[8px] font-primary truncate hover:bg-white-100 hover:bg-opacity-20 transition-all duration-100`}
		>
			<div className="h-full flex flex-row items-center justify-between gap-8">
				<div className={``}>{props.name}</div>
				{props.comingSoon && (
					<div
						className={`font-light text-[8px] text-gray-200 bg-gray-380 rounded-lg py-[2px] px-2`}
					>
						Coming soon
					</div>
				)}
			</div>
		</div>
	);
}
