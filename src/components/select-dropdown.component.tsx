'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { SelectDropdownItem } from './select-dropdown-item.component';

interface DropdownItem {
	label: string;
	value: any;
	divider?: boolean;
	danger?: boolean;
	click: (selected: boolean) => void;
	icon?: React.ReactNode; // Add icon support
}

interface Props {
	trigger: any;
	items: DropdownItem[];
	multiSelection?: boolean;
	values: {
		label: string;
		value: any;
	}[];
}

export function SelectDropdown({ trigger, items, multiSelection = false, values }: Props) {
	const element = useRef<any>();
	const [isOpened, setIsOpened] = useState(false);
	const [selected, setSelected] = useState<any[]>([]);
	const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
	const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
	const [lastSearch, setLastSearch] = useState<{
		char: string;
		matchIndexes: number[];
		matchPointer: number;
	} | null>(null);

	function changeSelected(isSelected: boolean, value: any) {
		if (!multiSelection) {
			setSelected(isSelected ? [value] : []);
		} else {
			if (isSelected) {
				setSelected([...selected, value]);
			} else {
				const mapSelected = selected.filter((item) => item !== value);
				setSelected(mapSelected);
			}
		}
	}

	useEffect(() => {
		const selected = values.map((value) => value.value);
		setSelected(selected);
	}, [values]);

	useEffect(() => {
		const handler = (event: any) => {
			if (!element.current) {
				return;
			}
			if (!element.current.contains(event.target) && !trigger.current.contains(event.target)) {
				setIsOpened(false);
			}
		};
		document.addEventListener('click', handler, true);
		return () => {
			document.removeEventListener('click', handler);
		};
	}, []);

	useEffect(() => {
		const handleClick = () => {
			const isOpened = JSON.parse(element.current.getAttribute('data-open'));
			setIsOpened(!isOpened);
		};
		trigger.current.addEventListener('click', handleClick);
		return () => {
			if (trigger.current) {
				trigger.current.removeEventListener('click', handleClick);
			}
		};
	}, []);

	useEffect(() => {
		if (!isOpened) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key.length === 1 && /^[a-z0-9]$/i.test(e.key)) {
				const char = e.key.toLowerCase();
				const matchIndexes = items
					.map((item, idx) => (item.label.toLowerCase().startsWith(char) ? idx : -1))
					.filter((idx) => idx !== -1);
				if (matchIndexes.length === 0) return;

				if (lastSearch && lastSearch.char === char) {
					// Cycle to next match
					const nextPointer = (lastSearch.matchPointer + 1) % matchIndexes.length;
					setHighlightedIndex(matchIndexes[nextPointer]);
					itemRefs.current[matchIndexes[nextPointer]]?.scrollIntoView({ block: 'nearest' });
					setLastSearch({ char, matchIndexes, matchPointer: nextPointer });
				} else {
					// Start from first match
					setHighlightedIndex(matchIndexes[0]);
					itemRefs.current[matchIndexes[0]]?.scrollIntoView({ block: 'nearest' });
					setLastSearch({ char, matchIndexes, matchPointer: 0 });
				}
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpened, items, lastSearch]);

	return (
		<div
			className={`absolute w-full p-2 my-[2px] z-10 bg-gray-800 rounded-[8px] shadow-lg focus:outline-none border border-green-600 ${isOpened ? '' : 'hidden'}`}
			ref={element}
			data-open={isOpened}
			style={{ maxHeight: '300px', overflowY: 'auto' }}
		>
			<div role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
				<ul className="">
					{items.map((item, index) => (
						<Fragment key={index}>
							<div
								ref={(el) => {
									itemRefs.current[index] = el;
								}}
								className={`w-full flex items-center cursor-pointer hover:bg-gray-700 rounded ${highlightedIndex === index ? 'bg-green-700' : ''}`}
							>
								<SelectDropdownItem
									name={item.label}
									selected={selected.includes(item.value)}
									multiSelection={multiSelection}
									icon={item.icon}
									click={(selected: boolean) => {
										setIsOpened(false);
										changeSelected(selected, item.value);
										item.click(selected);
										setHighlightedIndex(null);
										setLastSearch(null);
									}}
								/>
							</div>
						</Fragment>
					))}
				</ul>
			</div>
		</div>
	);
}
