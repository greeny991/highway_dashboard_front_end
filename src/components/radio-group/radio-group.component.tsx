'use client';

import React from 'react';
import styles from './style.module.scss';

export function RadioGroup(props: any) {
	return (
		<div className="w-full flex">
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
			<div className="flex flex-col items-center justify-between pl-[10px]">
				<p className="font-primary font-normal text-[14px] text-white-100 w-full">{props.label}</p>
				{props.description && (
					<p className="font-primary font-normal text-[10px] text-gray-300 uppercase w-full">
						{props.description}
					</p>
				)}
			</div>
		</div>
	);
}
