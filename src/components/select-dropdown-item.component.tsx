import { ReactNode } from 'react';

interface Props {
	name: string;
	selected: boolean;
	multiSelection: boolean;
	click: (selected: boolean) => void;
	icon?: ReactNode; // Add icon support
}

export function SelectDropdownItem({ name, multiSelection, selected, click, icon }: Props) {
	return (
		<li
			className={`${selected ? 'bg-green-600' : 'hover:bg-green-600'} text-white-100 block w-full h-[48px] px-[12px] font-normal text-[12px] rounded-[8px] font-primary truncate transition-all duration-100 mt-[2px]`}
		>
			<div
				className="h-full flex items-center gap-4 cursor-pointer"
				onClick={() => click(!selected)}
			>
				{multiSelection && (
					<div className="flex items-center justify-center h-[16px] w-[16px] rounded-[4px] bg-gray-925">
						{selected && <div className="h-[12px] w-[12px] rounded-[4px] bg-green-200"></div>}
					</div>
				)}

				{/* Render Icon Here */}
				{icon && <div className="w-5 h-5 flex items-center justify-center">{icon}</div>}

				<div className="fill-white-100 h-full flex flex-row items-center justify-start py-2">
					{name}
				</div>
			</div>
		</li>
	);
}
