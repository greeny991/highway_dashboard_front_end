'use client';

import styles from './style.module.scss';

interface Props {
	name: string;
	color?: string;
	size?:
		| 'tiny'
		| 'ten'
		| 'tenx'
		| 'small'
		| 'smedium'
		| 'medium'
		| 'medium-large'
		| 'large'
		| 'xxl';
	className?: string;
	onClick?: () => void;
}

export function Icon({ name, color, size = 'small', className, onClick }: Props) {
	return (
		<div onClick={onClick} className={`${styles.icon} ${className}`}>
			<svg className={`${color ? color : ''} ${size}`}>
				<use xlinkHref={`/icons/sprite.svg?v10#${name}`} />
			</svg>
		</div>
	);
}
