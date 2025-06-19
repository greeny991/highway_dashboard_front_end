'use client';

import styles from './style.module.scss';

type Props = {
	size: 'small' | 'medium' | 'large';
};

export function InlineLoader({ size }: Props) {
	return <div className={`${styles.loader} ${styles[size]}`} />;
}
