'use client';

import ReactSlider from 'react-slick';
import { useRef, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './style.module.scss';

interface Props {
	images: string[];
	title: string;
	subtitle: string;
}

export function Slider({ images, title, subtitle }: Props) {
	let sliderRef: any = useRef(null);
	const [current, setCurrent] = useState(0);
	const next = (p: any) => {
		sliderRef.slickNext();
	};
	const previous = (p: any) => {
		sliderRef.slickPrev();
	};
	const sliderSettings = {
		dots: false,
		arrows: false,
		infinite: true,
		focusOnSelect: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		beforeChange: (prev: number, current: number) => setCurrent(current)
	};

	return (
		<div className="w-full h-full flex overflow-hidden rounded-[8px] relative">
			<div className={`${styles.images} w-full h-full relative`}>
				<ReactSlider
					{...sliderSettings}
					ref={(slider: any) => {
						sliderRef = slider;
					}}
				>
					{images.map((image, index) => (
						<div key={index} className="h-full outline-none">
							<img src={image} className="block h-full w-full object-cover" />
						</div>
					))}
				</ReactSlider>
			</div>

			<div
				className={`${styles.text} absolute flex justify-center items-center w-full h-full px-[48px] flex-col`}
			>
				<p className="font-primary font-medium text-[32px] lg:text-[40px] xl:text-[48px] text-white-100 uppercase  text-center">
					{title}
				</p>
				{/* <p className="font-primary font-extralight text-[8px] lg:text-[10px] xl:text-[12px] text-white-50 uppercase  text-center pt-3">
					{subtitle}
				</p> */}
			</div>

			<div className="w-full flex absolute text-white-60 uppercase px-[48px] justify-between bottom-[50px]">
				<div
					className={`${styles.prevButtom} group hover:text-green-200 cursor-pointer flex items-center`}
					onClick={previous}
				>
					<svg
						width="5"
						height="10"
						viewBox="0 0 5 10"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4.76006 2.05759C5.06006 1.76759 5.06006 1.29759 4.77006 0.997588C4.62006 0.847588 4.43006 0.777588 4.23006 0.777588C4.04006 0.777588 3.85006 0.847588 3.71006 0.997588L0.220062 4.46759C0.0800624 4.60759 6.24657e-05 4.79759 6.24657e-05 4.99759C6.24657e-05 5.19759 0.0800624 5.38759 0.220062 5.52759L3.71006 8.99759C4.00006 9.29759 4.47006 9.29759 4.77006 8.99759C5.06006 8.70759 5.06006 8.22759 4.76006 7.93759L1.81006 4.99759L4.76006 2.05759Z"
							className="fill-white-60 group-hover:fill-green-200"
						/>
					</svg>
					<span className="pl-3 text-[12px]">Previous</span>
				</div>

				<div className="bg-white-10 rounded-[80pc] flex p-[4px] justify-center items-center">
					{images.map((image, index) => (
						<div
							key={index}
							className={`${current === index ? 'w-[26px] rounded-[17px] bg-green-200' : 'w-[6px] rounded-full bg-white-30'} h-[6px] mx-[3px] transition-all duration-500`}
						></div>
					))}
				</div>

				<div
					className={`${styles.nextButtom} group hover:text-green-200 cursor-pointer flex items-center`}
					onClick={next}
				>
					<span className="pr-3 text-[12px]">next</span>
					<svg
						width="5"
						height="10"
						viewBox="0 0 5 10"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M0.239938 2.05759C-0.0600622 1.76759 -0.0600622 1.29759 0.229938 0.997588C0.379938 0.847588 0.569938 0.777588 0.769938 0.777588C0.959938 0.777588 1.14994 0.847588 1.28994 0.997588L4.77994 4.46759C4.91994 4.60759 4.99994 4.79759 4.99994 4.99759C4.99994 5.19759 4.91994 5.38759 4.77994 5.52759L1.28994 8.99759C0.999938 9.29759 0.529938 9.29759 0.229938 8.99759C-0.0600622 8.70759 -0.0600622 8.22759 0.239938 7.93759L3.18994 4.99759L0.239938 2.05759Z"
							className="fill-white-60 group-hover:fill-green-200"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}
