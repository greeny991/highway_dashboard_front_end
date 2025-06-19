'use client';

import styles from './radio-group/style.module.scss';

interface Props {
	name: string;
	description: string;
	price: string;
	value: string;
	selected: string;
	readonly?: boolean;
	onChange: (value: string) => void;
}

export function SelectPackage(props: Props) {
	return (
		<div className="flex items-center border border-gray-460 px-4 py-3 rounded-md">
			{!props.readonly && (
				<div className={styles.radioGroup}>
					<label className={styles.radioLabel}>
						<input
							type="radio"
							name={props.name}
							value={props.value}
							checked={props.selected === props.value}
							onChange={() => props.onChange(props.value)}
							className={styles.radioInput}
						/>
						<span
							className={`${styles.radioCustom} ${props.selected === props.value ? styles.checked : ''}`}
						></span>
					</label>
				</div>
			)}
			<div className="flex flex-col w-full justify-start ml-4 gap-[8px]">
				<div className="font-primary text-[16px] leading-[18.75px] text-white-100 font-medium uppercase">
					{props.name}
				</div>
				<div className="font-primary text-[16px] leading-[18.75px] text-gray-462 font-normal uppercase">
					{props.description}
				</div>
				<div className="font-primary text-[16px] leading-[18.75px] text-green-200 font-normal uppercase">
					{props.price}
				</div>
			</div>
		</div>
	);
}
