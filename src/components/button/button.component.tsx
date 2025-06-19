'use client';

import { LegacyRef } from 'react';
import styles from './style.module.scss';

const ButtonType: any = {
	default:
		'px-[24px] rounded-[8px] h-[32px] xl:h-[48px] bg-gray-650 text-gray-150 hover:text-white-100 disabled:text-gray-350 disabled:bg-gray-850 transition-all duration-300',
	primary:
		'px-[24px] rounded-[8px] h-[32px] xl:h-[48px] bg-green-200 hover:bg-green-600 text-gray-950 disabled:bg-gray-650 disabled:text-gray-625 transition-all duration-300',
	secondary:
		'px-[24px] rounded-[8px] h-[32px] xl:h-[48px] group bg-gray-725 text-white-100 hover:bg-gray-525 hover:text-gray-925 disabled:text-gray-625 disabled:bg-gray-910 transition-all duration-300',
	icon: 'rounded-[8px] w-[32px] h-[32px] fill-gray-200 disabled:opacity-50 transition-all duration-300',
	danger:
		'px-[24px] rounded-[8px] h-[32px] xl:h-[48px] bg-red-200 text-gray-150 hover:text-white-100 disabled:text-gray-350 disabled:bg-gray-850 transition-all duration-300',
	tiny: 'rounded-[8px] h-[29.65px] xl:h-[36px] px-[19.76px] xl:px-[24px] bg-green-900 hover:bg-green-200 text-[13px] font-medium text-white-100 hover:text-green-600 disabled:bg-gray-650 disabled:text-gray-625 transition-all duration-300',
	tertiary:
		'px-[24px] rounded-[8px] h-[32px] xl:h-[48px] w-full xl:w-fit bg-green-900 hover:bg-green-200 text-[16px] font-bold text-green-200 hover:text-green-600 disabled:bg-gray-650 disabled:text-gray-625 transition-all duration-300',
	text: 'px-[24px] text-[10px] xl:text-[10px] font-bold text-white-100 uppercase underline disabled:text-gray-625 transition-all duration-300',
	border:
		'px-[24px] rounded-[8px] h-[32px] xl:h-[48px] border-solid border-[1px] border-green-200 bg-transparent hover:bg-green-600 hover:border-green-600 text-green-200 disabled:bg-gray-650 disabled:text-gray-625 transition-all duration-300',
	explore:
		'px-[9px] py-[11px] text-[12px] xl:text-[12px] leading-7 rounded-[8px] h-[32px] xl:h-[40px] bg-green-200 hover:bg-green-600 text-gray-950 disabled:bg-gray-650 disabled:text-gray-625 transition-all duration-300'
};

type IconColorType =
	| 'default'
	| 'primary'
	| 'primary-dark'
	| 'secondary'
	| 'icon'
	| 'icon-primary'
	| 'icon-danger'
	| 'null';

interface Props {
	type?: string;
	iconColorType?: IconColorType;
	fluid?: boolean;
	disabled?: boolean;
	reverse?: boolean;
	square?: boolean;
	alignStart?: boolean;
	textColor?: string;
	bgColor?: string;
	ref?: LegacyRef<HTMLButtonElement>;
	children: any;
	title?: string;
	className?: string;
	onClick?: () => void;
}

export function Button(props: Props) {
	return (
		<button
			onClick={props.onClick}
			disabled={props.disabled}
			ref={props.ref}
			title={props.title}
			className={`
        ${props.className}
        ${styles.button}
        ${styles[props.iconColorType || props.type || 'default']}
        ${ButtonType[props.type || 'default']}
        ${props.fluid ? 'w-full' : ''}
        ${props.square ? 'w-[48px]' : ''}
        ${props.alignStart ? 'justify-start' : 'justify-center'}   
        ${props.textColor} 
        ${props.bgColor}   
        font-primary font-normal text-[12px] xl:text-[14px] flex items-center truncate`}
		>
			{props.children}
		</button>
	);
}
