'use client';

import ReactPlayer from 'react-player';
import { useEffect, useState, useRef } from 'react';
import { Loader } from '@/components/loader/loader.component';
import { PublicationRating } from '@/interfaces/publication.interface';
import { useDla } from '@/contexts/dla.context';
import { getDeviceType } from '@/utils/device-detection';
import { GeoService } from '@/services/geo.service';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';

interface IControls {
	markInOut: boolean;
	previewMode: boolean;
	markInOutCallback?: (values: { in: number; out: number }) => void;
}

interface IContentInfo {
	title?: string;
	subtitle?: string;
	companyLogo?: string;
	rating?: PublicationRating;
}

interface Props {
	videoUrl: string;
	autoplay: boolean;
	controls: IControls;
	contentInfo?: IContentInfo;
	onReady?: (ready: boolean) => void;
	embedded?: boolean;
	publicationId?: string;
}

export function VideoPlayerBasic(props: Props) {
	const [ready, setReady] = useState(false);
	const [inPoint, setInPoint] = useState<number | null>(null);
	const [outPoint, setOutPoint] = useState<number | null>(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [dragging, setDragging] = useState<'in' | 'out' | null>(null);
	const [showOverlay, setShowOverlay] = useState(true);
	const overlayTimeout = useRef<NodeJS.Timeout | null>(null);
	const barRef = useRef<HTMLDivElement | null>(null);
	const playerRef = useRef<any>(null);
	const viewStartTime = useRef<number>(0);
	const viewTrackingInterval = useRef<NodeJS.Timeout | null>(null);
	const viewId = useRef<string | null>(null);
	const hasCreatedView = useRef<boolean>(false);
	const { WatchService } = useDla();
	const { authenticator } = useAuthenticator();

	// Overlay show/hide logic
	const handleMouseMove = () => {
		setShowOverlay(true);
		if (overlayTimeout.current) clearTimeout(overlayTimeout.current);
		overlayTimeout.current = setTimeout(() => setShowOverlay(false), 2500);
	};

	useEffect(() => {
		if (props.onReady) {
			props.onReady(true);
		}
		setReady(true);
	}, []);

	const startTracking = async () => {
		// Only create a view record if we haven't created one yet
		if (!hasCreatedView.current) {
			try {
				const countryCode = await GeoService.getInstance().getCountryCode();
				const deviceType = getDeviceType();
				const userId = authenticator?.user?.id;
				const viewData: any = {
					device: deviceType,
					country: countryCode
				};
				if (userId) {
					viewData.userId = userId;
				}
				const response = await WatchService.createView(props.publicationId!, viewData);
				viewId.current = response.id;
				hasCreatedView.current = true;
			} catch (error) {
				console.error('Failed to create view record:', error);
				return;
			}
		}

		// Start tracking time
		viewStartTime.current = Date.now();

		// Send view duration updates every 30 seconds
		viewTrackingInterval.current = setInterval(async () => {
			if (!viewId.current) return;
			const viewDuration = Math.floor((Date.now() - viewStartTime.current) / 1000);
			try {
				await WatchService.updateViewDuration(viewId.current, viewDuration);
			} catch (error) {
				console.error('Failed to update view duration:', error);
			}
		}, 30000);
	};

	const stopTracking = async () => {
		if (viewTrackingInterval.current) {
			clearInterval(viewTrackingInterval.current);
			viewTrackingInterval.current = null;
		}
		// Send final view duration
		if (viewId.current) {
			const viewDuration = Math.floor((Date.now() - viewStartTime.current) / 1000);
			if (viewDuration > 0) {
				try {
					await WatchService.updateViewDuration(viewId.current, viewDuration);
				} catch (error) {
					console.error('Failed to update final view duration:', error);
				}
			}
		}
	};

	// Reset view tracking when component unmounts
	useEffect(() => {
		return () => {
			stopTracking();
			hasCreatedView.current = false;
			viewId.current = null;
		};
	}, []);

	// If previewMode is on, restrict playback to in/out points
	useEffect(() => {
		if (!props.controls.previewMode) return;
		if (inPoint !== null && currentTime < inPoint) {
			playerRef.current?.seekTo(inPoint, 'seconds');
		}
		if (outPoint !== null && currentTime > outPoint) {
			playerRef.current?.seekTo(outPoint, 'seconds');
			playerRef.current?.getInternalPlayer()?.pause?.();
		}
	}, [props.controls.previewMode, inPoint, outPoint, currentTime]);

	const handleDuration = (dur: number) => {
		setDuration(dur);
		if (outPoint === null) setOutPoint(dur);
	};

	const getPercent = (time: number | null) => {
		if (!duration || time === null) return 0;
		return (time / duration) * 100;
	};

	const handleBarMouseDown = (e: React.MouseEvent, type: 'in' | 'out') => {
		setDragging(type);
		document.body.style.userSelect = 'none';
	};

	const handleBarMouseMove = (e: MouseEvent) => {
		if (!dragging || !barRef.current || !duration) return;
		const rect = barRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		let percent = Math.max(0, Math.min(1, x / rect.width));
		let time = percent * duration;
		if (dragging === 'in') {
			if (outPoint !== null && time > outPoint) time = outPoint;
			setInPoint(time);
			playerRef.current?.seekTo(time, 'seconds');
			if (props.controls.markInOutCallback) {
				props.controls.markInOutCallback({
					in: Number(time.toFixed(3)),
					out: Number(outPoint?.toFixed(3)) ?? duration
				});
			}
		} else if (dragging === 'out') {
			if (inPoint !== null && time < inPoint) time = inPoint;
			setOutPoint(time);
			playerRef.current?.seekTo(time, 'seconds');
			if (props.controls.markInOutCallback) {
				props.controls.markInOutCallback({
					in: Number(inPoint?.toFixed(3)) ?? 0,
					out: Number(time.toFixed(3))
				});
			}
		}
	};

	const handleBarMouseUp = () => {
		setDragging(null);
		document.body.style.userSelect = '';
	};

	useEffect(() => {
		if (!dragging) return;
		document.addEventListener('mousemove', handleBarMouseMove);
		document.addEventListener('mouseup', handleBarMouseUp);
		return () => {
			document.removeEventListener('mousemove', handleBarMouseMove);
			document.removeEventListener('mouseup', handleBarMouseUp);
		};
	}, [dragging, inPoint, outPoint, duration]);

	const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
		setCurrentTime(playedSeconds);
	};

	return (
		<div
			className={`w-full h-full aspect-video ${props.embedded ? 'bg-gray-925' : ''} relative`}
			onMouseMove={handleMouseMove}
		>
			<ReactPlayer
				ref={playerRef}
				url={props.videoUrl}
				width="100%"
				height="100%"
				playing={props.autoplay}
				controls={true}
				onReady={() => setReady(true)}
				onProgress={handleProgress}
				onDuration={handleDuration}
				onPlay={() => {
					if (props.publicationId) {
						startTracking();
					}
				}}
				onPause={() => {
					if (props.publicationId) {
						stopTracking();
					}
				}}
			/>

			{/* Overlay for content info */}
			{showOverlay && (
				<div className="absolute top-0 left-0 w-full flex flex-row items-start p-6 z-40 pointer-events-none transition-opacity duration-500 opacity-100">
					{props.contentInfo?.companyLogo && (
						<img
							src={props.contentInfo.companyLogo}
							alt="logo"
							className="h-12 w-12 rounded mr-4"
						/>
					)}
					<div>
						{props.contentInfo?.title && (
							<div className="text-white-100 text-xl font-bold drop-shadow-lg">
								{props.contentInfo.title}
							</div>
						)}
						{props.contentInfo?.subtitle && (
							<div className="text-white-100 text-base drop-shadow-lg mt-1">
								{props.contentInfo.subtitle}
							</div>
						)}
						{props.contentInfo?.rating && (
							<div className="text-yellow-300 text-xs font-semibold mt-2">
								{props.contentInfo.rating}
							</div>
						)}
					</div>
				</div>
			)}

			{/* Custom Progress Bar for In/Out Points */}
			{props.controls.markInOut && duration > 0 && (
				<div className="absolute left-0 right-0 bottom-5 px-4 ">
					<div
						ref={barRef}
						className="relative w-full h-1 bg-gray-700 rounded cursor-pointer select-none"
					>
						{/* Highlighted segment */}
						<div
							className="absolute h-full bg-green-400  rounded pointer-events-none"
							style={{
								left: `${getPercent(inPoint)}%`,
								width: `${getPercent(outPoint) - getPercent(inPoint)}%`,
								zIndex: 30
							}}
						/>
						{/* In handle */}
						<div
							className="absolute top-0 w-6 h-2 -mt-1 -ml-3 flex items-center justify-center cursor-ew-resize z-30"
							style={{ left: `calc(${getPercent(inPoint)}% )` }}
							onMouseDown={(e) => handleBarMouseDown(e, 'in')}
						>
							<span className="text-green-400 text-xl font-bold">[</span>
						</div>
						{/* Out handle */}
						<div
							className="absolute top-0 w-6 h-2 -mt-1 -ml-3 flex items-center justify-center cursor-ew-resize z-30"
							style={{ left: `calc(${getPercent(outPoint)}% )` }}
							onMouseDown={(e) => handleBarMouseDown(e, 'out')}
						>
							<span className="text-yellow-300 text-xl font-bold">]</span>
						</div>
						{/* Current time indicator */}
						<div
							className="absolute top-0 left-0 h-1 bg-blue-400 z-20 "
							style={{ width: `calc(${getPercent(currentTime)}% - 2px)` }}
						>
							{/* dot */}
							<div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+1px)] size-3 bg-white-100 rounded-full" />
						</div>
					</div>
				</div>
			)}

			{!ready && (
				<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
					<Loader />
				</div>
			)}
		</div>
	);
}
