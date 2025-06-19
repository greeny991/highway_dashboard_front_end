'use client';

import { Slider } from '@/components/slider/slider.component';
import { SignupGuard } from '@/guards/signup.guard';

export default function SignupLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex h-full min-h-[768px]">
			<div className="w-1/2 h-full p-[4px] sm:p-[12px] md:p-[24px]">
				<Slider
					images={['/images/19.png', '/images/201.png', '/images/181.png']}
					title="Finally content you can control"
					subtitle="Lorem ipsum dolor sit amet"
				/>
			</div>
			<div className="relative w-1/2 h-full p-[24px] flex items-center justify-center">
				{children}
			</div>
		</main>
	);
}
