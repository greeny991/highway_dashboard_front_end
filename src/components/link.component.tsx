'use client';

const LinkType: any = {
	default: 'text-white-60 hover:text-green-200',
	primary: 'text-green-200 hover:text-green-600'
};

interface Props {
	type?: string;
	label?: string;
	click?: () => void;
}

export function Link(props: Props) {
	return (
		<a
			onClick={props.click}
			className={`${LinkType[props.type || 'default']}
      block text-[10px] font-primary   font-normal uppercase cursor-pointer`}
		>
			{props.label}
		</a>
	);
}
