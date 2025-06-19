'use client';

import '/node_modules/flag-icons/css/flag-icons.min.css';

interface Props {
	title: string;
	value?: string;
	languages?: {}[];
}

export function AssetInfoItem(props: Props) {
	return (
		<div className="w-full h-fit">
			<div className="flex items-center justify-evenly">
				<label className="block w-1/6 text-[10px] text-white-100 font-extralight uppercase overflow-hidden">
					<span className="line-clamp-2">{props.title}</span>
				</label>
				<label className="block w-full text-[12px] text-white-100 font-normal overflow-hidden">
					{props.value ? (
						<span className="line-clamp-2">{props.value}</span>
					) : (
						<div className="flex gap-4">
							{props.languages?.map(({ flag, language }: any, index) => (
								<div key={index} className="flex flex-row gap-1">
									<span key={index} className={`fi fis fi-${flag}`}></span>
									<span className="line-clamp-2">{language}</span>
								</div>
							))}
						</div>
					)}
				</label>
			</div>
			<hr className="w-full h-px mt-4 bg-white-10 border-0 rounded" />
		</div>
	);
}
