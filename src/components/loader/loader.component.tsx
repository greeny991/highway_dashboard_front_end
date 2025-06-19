'use client';

import { useState } from 'react';
import styles from './style.module.scss';

type Props = {
	backdrop?: boolean;
};

export function Loader({ backdrop = true }: Props) {
	return (
		<div
			className={`absolute flex w-full h-full rounded-[8px] p-4 justify-center items-center ${backdrop ? 'bg-gray-910 bg-opacity-95' : ''}`}
		>
			<div className={`${styles.loader}`} />
		</div>
	);
}
