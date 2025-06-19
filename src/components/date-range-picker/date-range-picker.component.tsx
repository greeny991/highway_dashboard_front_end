'use client';

import { FormatDate } from '@/utils/format-date.util';
import { useEffect, useRef, useState } from 'react';
import ReactDatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import styles from './style.module.scss';

interface Props {
	label?: string;
	startDate?: Date;
	endDate?: Date;
	error?: string;
	onChange: (dates: [Date | null, Date | null]) => void;
}

export function DateRangePicker(props: Props) {
	function getDefaultStartDate(endDate: Date | undefined): Date {
		if (!endDate) {
			const today = new Date();
			return new Date(today.setDate(today.getDate() - 30));
		}
		return new Date(endDate.setDate(endDate.getDate() - 30));
	}

	const [defaultDates] = useState<[Date, Date]>([
		getDefaultStartDate(props.endDate),
		props.endDate || new Date()
	]);

	const [hasInitialDates] = useState(!!props.startDate || !!props.endDate);

	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
		props.startDate || defaultDates[0],
		props.endDate || defaultDates[1]
	]);
	const ref = useRef<any>();

	const [startDate, endDate] = dateRange;

	function toggleDatePicker() {
		ref.current.setOpen(true);
	}

	useEffect(() => {
		if (props.startDate !== undefined || props.endDate !== undefined) {
			setDateRange([
				props.startDate || getDefaultStartDate(props.endDate),
				props.endDate || new Date()
			]);
		}
	}, [props.startDate, props.endDate]);

	const handleChange = (update: [Date | null, Date | null]) => {
		setDateRange(update);
		props.onChange(update);
	};

	const getDisplayText = () => {
		if (!startDate || !endDate) {
			return <span>Last 30 days</span>;
		}

		if (
			!hasInitialDates &&
			startDate.getTime() === defaultDates[0].getTime() &&
			endDate.getTime() === defaultDates[1].getTime()
		) {
			return <span>Last 30 days</span>;
		}

		return (
			<div className="flex items-center w-full">
				<span>
					<span className="mx-1 opacity-60">Select Date</span> {FormatDate(startDate)}{' '}
					<span className="mx-1 opacity-60">—</span> {FormatDate(endDate)}
				</span>
			</div>
		);
	};

	return (
		<div className={`${styles.wrapper} w-full`}>
			{props.label && (
				<label className="block mb-2 text-[8px] font-extralight uppercase text-white-60">
					{props.label}
				</label>
			)}

			<div className="relative w-full">
				<div
					onClick={toggleDatePicker}
					className="relative z-0 cursor-pointer w-full h-[48px] flex items-center p-2 rounded-lg bg-gray-900 text-[12px] text-gray-462"
				>
					{getDisplayText()}
				</div>

				<div className="absolute w-full h-[48px] top-0 z-1">
					<ReactDatePicker
						ref={ref}
						onChange={handleChange}
						startDate={startDate || undefined}
						endDate={endDate || undefined}
						selectsRange
						dateFormat="dd-MM-yyyy"
						closeOnScroll={true}
						maxDate={new Date()}
						dropdownMode="scroll"
						showMonthDropdown
						showYearDropdown
						yearDropdownItemNumber={124}
						scrollableYearDropdown
					/>
				</div>
			</div>
		</div>
	);
}
