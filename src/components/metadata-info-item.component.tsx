'use client';

import '/node_modules/flag-icons/css/flag-icons.min.css';

interface Props {
	title: string;
	value?: string;
	multipleValues?: {}[];
}

export function MetadetaInfoItem(props: Props) {
	return (
		<div className="w-full h-fit">
			<div className="flex items-center justify-start">
				<label className="block w-1/6 text-[10px] text-white-100 font-extralight uppercase overflow-hidden">
					<span className="line-clamp-2">{props.title}</span>
				</label>
				<label className="block w-full text-[12px] text-white-100 font-normal overflow-hidden">
					{props.value ? (
						<span className="line-clamp-2">{props.value}</span>
					) : (
						<div className="flex flex-col gap-2">
							{props.multipleValues?.map(({ position, name }: any, index) => (
								<div key={index} className="flex flex-row items-center justify-start">
									<span className="line-clamp-2 pr-[20px]">
										{position.charAt(0).toUpperCase() + position.slice(1)}:
									</span>
									<span className="line-clamp-2 w-full">
										{name.charAt(0).toUpperCase() + name.slice(1)}
									</span>
								</div>
							))}
						</div>
					)}
				</label>
			</div>
			<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
		</div>
	);
}
