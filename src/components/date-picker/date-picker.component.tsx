'use client';

import { FormatDate } from '@/utils/format-date.util';
import { useEffect, useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './style.module.scss';

interface Props {
	label?: string;
	value?: Date;
	error?: string;
	onChange: (value: any) => any;
}

export function DatePicker(props: Props) {
	const [value, setValue] = useState(props.value);
	const ref = useRef<any>();
	const maxDate: Date = new Date();
	maxDate.setFullYear(maxDate.getFullYear() + 10);

	function toggleDatePicker() {
		ref.current.setOpen(true);
	}

	useEffect(() => {
		setValue(props.value);
	}, [props.value]);

	return (
		<div className={`${styles.wrapper} w-full`}>
			<label className="block mb-2 text-[8px] font-extralight uppercase text-white-60">
				{props.label}
			</label>

			<div className="relative w-full">
				<div
					onClick={toggleDatePicker}
					className="relative z-0 cursor-pointer w-full h-[48px] flex items-center p-2 rounded-lg bg-gray-900 text-[12px] text-white-100 placeholder:text-[12px] placeholder:text-white-60"
				>
					{value && FormatDate(value as Date)}
				</div>

				<div className="absolute w-full h-[48px] top-0 z-1">
					<ReactDatePicker
						ref={ref}
						selected={value}
						dateFormat="dd-MM-yyyy"
						onChange={(date: any) => props.onChange(date)}
						closeOnScroll={true}
						dropdownMode="scroll"
						showMonthDropdown
						showYearDropdown
						yearDropdownItemNumber={124}
						maxDate={maxDate}
						scrollableYearDropdown
					/>
				</div>
			</div>
		</div>
	);
}
