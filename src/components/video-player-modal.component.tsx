// @ts-nocheck
'use client';

import { useEffect, useRef } from 'react';
import { Icon } from './icon/icon.component';
import { Button } from './button/button.component';
import { IMedia } from '@/interfaces/media.interface';

interface Props {
	isOpen: boolean;
	media: IMedia;
	onClose: () => void;
}

export function VideoPlayerModal(props: Props) {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && props.media?.fileUrl) {
			videoRef.current.load();
		}
	}, [props.media?.fileUrl]);

	if (!props.isOpen) return null;

	return (
		<div className="fixed inset-0 bg-gray-950 bg-opacity-75 z-50 flex items-center justify-center">
			<div className="relative w-4/5 aspect-video bg-gray-900 rounded-[8px]">
				<div className="absolute top-4 right-4 z-10">
					<Button type="icon" iconColorType="null" onClick={props.onClose}>
						<Icon
							name="close"
							size="medium"
							className="fill-white-100 rounded-full p-2 bg-gray-950 hover:bg-green-200 hover:fill-gray-950 transition-all duration-200"
						/>
					</Button>
				</div>
				<video
					ref={videoRef}
					className="w-full h-full rounded-[8px]"
					controls
					playsInline
					controlsList="nodownload"
					autoPlay
				>
					{props.media?.fileUrl && <source src={props.media.fileUrl} type={props.media.fileType} />}
					Your browser does not support the video tag.
				</video>
			</div>
		</div>
	);
}
