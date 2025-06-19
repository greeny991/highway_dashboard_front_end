import { Slider } from '@/components/slider/slider.component';

export default function SigninLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="flex h-full min-h-[768px]">
			<div className="w-1/2 h-full p-[24px]">
				<Slider
					images={['/images/19.png', '/images/201.png', '/images/181.png']}
					title="Finally content you can control"
					subtitle="Lorem ipsum dolor sit amet"
				/>
			</div>
			<div className="w-1/2 h-full p-[24px] flex items-center justify-center">{children}</div>
		</main>
	);
}
