'use client';

interface Props {
	price: string;
	children: any;
	disabled?: boolean;
	onClick?: () => void;
}

export function ByButton(props: Props) {
	return (
		<button
			onClick={props.onClick}
			disabled={props.disabled}
			className={`
        group
        px-[24px] xl:pt-[12px] xl:pb-[12px] rounded-[8px] h-[48px] xl:h-auto w-full xl:w-fit 
        bg-[rgba(72,72,24,0.7)] hover:bg-yellow-900
        disabled:bg-gray-650
        font-primary font-normal 
        flex flex-row items-center xl:items-start justify-center truncate
        transition-all duration-300`}
		>
			<span
				className={`
          ${props.disabled ? 'text-gray-625' : 'text-white-100'}
          group text-[16px] group-hover:text-yellow-250 font-medium transition-all duration-300 pr-[10px]
        `}
			>
				{props.children}
			</span>
			<span
				className={`
          ${props.disabled ? 'text-gray-625' : 'text-yellow-900'}
          group text-[16px] xl:pl-[0px] disabled:text-gray-625 group-hover:text-yellow-250 font-medium transition-all duration-300
        `}
			>
				{props.price}
			</span>
		</button>
	);
}
