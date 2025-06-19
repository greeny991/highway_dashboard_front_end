'use client';

import { Dropdown } from './dropdown/dropdown.component';
import { Icon } from './icon/icon.component';
import { useRef, useState } from 'react';

interface TableControlsProps {
	sortOptions: string[];
	onSortChange: (selectedSort: string) => void;
}

export function TableControls(props: TableControlsProps) {
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const [selectedSort, setSelectedSort] = useState(props.sortOptions[0].toUpperCase());
	const dropdownTrigger = useRef<any>(null);

	const dropdownItems = props.sortOptions.map((option) => ({
		name: option.toUpperCase(),
		click: () => {
			props.onSortChange(option);
			setSelectedSort(option.toUpperCase());
		}
	}));

	return (
		<div className="flex flex-col">
			<div className="flex flex-row justify-end items-center w-full p-2">
				<div className="flex flex-row items-center font-primary mt-2 uppercase font-extralight text-[12px]">
					<Icon name="filter" size="small" className="p-[4px] fill-white-60" />
					<label className="text-nowrap text-white-60 pl-1 pr-4 py-1">SORT BY:</label>
					<div
						ref={dropdownTrigger}
						className="relative w-[160px] text-white-100 font-primary uppercase font-extralight text-[12px]"
					>
						<button className="flex justify-between items-center w-full">
							<span className="flex-1 text-left">{selectedSort}</span>
							<Icon name="chevron-down" size="small" className="flex fill-white-100" />
						</button>
						<Dropdown
							trigger={dropdownTrigger}
							position="absolute right-0 top-full mt-1"
							changeState={(isOpened) => setDropdownOpen(isOpened)}
							items={dropdownItems}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
