'use client';

import { Icon } from '@/components/icon/icon.component';
import { Button } from './button/button.component';

interface Props {
	message: string;
}

export function FloatingError(props: Props) {
	return (
		<div>
			<p className="font-primary font-normal text-[36px] text-white-100 uppercase  text-center">
				404 Page Not Found
				{/* <span style={{ whiteSpace: 'pre-line' }}>404{'\n'}Page not found</span> */}
			</p>
			<div className="p-1" />
			<p className="font-primary font-normal text-[12px] text-gray-200 uppercase  text-center">
				Our server is taking longer to respond than expected. Meanwhile, you might want to check
				your own connection, or you can try refreshing.
			</p>
			<div className="p-2" />
			<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
			<div className="p-2" />
			<Button type="danger" fluid>
				Refresh Page
			</Button>
			<div className="p-4" />
			<p className="font-primary font-normal text-[10px] text-gray-200 uppercase  text-center">
				We are working to reconnect as soon as possible.
			</p>
		</div>
	);
}
