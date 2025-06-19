'use client';

interface Props {
	value?: boolean;
	onChange: any;
}

export function Toggle(props: Props) {
	return (
		<label
			className="relative flex justify-between items-center group text-xl cursor-pointer"
			onChange={props.onChange}
		>
			<input
				type="checkbox"
				checked={props.value}
				className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md cursor-pointer"
			/>
			<span
				className="w-[44px] h-[24px] flex items-center flex-shrink-0 p-[2px] bg-gray-725 rounded-[15px] duration-300 ease-in-out
		  after:border-green-200 after:border-[2px] peer-checked:after:border-green-200 peer-checked:bg-green-600
		    after:w-[20px] after:h-[20px] after:bg-gray-725 peer-checked:after:bg-green-200 after:rounded-full after:shadow-md after:duration-300
		    peer-checked:after:translate-x-[20px]"
			></span>
		</label>
	);
}
