'use client';

import { Button } from '@/components/button/button.component';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();

	return (
		<main className="h-full w-full">
			<div className="flex w-full h-full items-center justify-center">
				<Image
					src="/images/bg-left.png"
					width={600}
					height={558}
					alt="Left Image"
					className="absolute left-0 w-1/3 pl-8"
				/>
				<div
					className="w-full h-full flex items-center justify-center
    bg-gray-950 bg-opacity-75 z-50"
				>
					<div className="relative z-10 flex flex-col w-[90%] md:w-[90%] md:max-w-[348px] lg:w-[75%] lg:max-w-[590px] bg-gray-800 p-9 rounded-[8px] justify-center items-center">
						<div className="p-4" />
						<p className="font-primary font-normal text-[36px] text-white-100 uppercase  text-center">
							404 Page Not Found
							{/* <span style={{ whiteSpace: 'pre-line' }}>404{'\n'}Page not found</span> */}
						</p>
						<div className="p-2" />
						<p className="font-primary font-normal text-[10px] text-gray-200 uppercase  text-center">
							Our server is taking longer to respond than expected. Meanwhile, you might want to
							check your own connection, or you can try refreshing.
						</p>
						<div className="p-2" />
						<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
						<div className="p-2" />
						<Button type="primary" fluid onClick={() => router.push('/', { scroll: false })}>
							Go back home
						</Button>
						<div className="p-4" />
						<p className="font-primary font-normal text-[10px] text-gray-200 uppercase  text-center">
							We are working to reconnect as soon as possible.
						</p>
					</div>
				</div>
				<Image
					src="/images/bg-right.png"
					alt="Right Image"
					className="absolute right-0 w-1/3 pr-8"
					width={600}
					height={558}
				/>
			</div>
		</main>
	);
}
