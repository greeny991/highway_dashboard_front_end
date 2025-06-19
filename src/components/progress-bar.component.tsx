'use client';

interface ProgressBarProps {
	usedMinutes: number;
	totalTimeInMinutes: number;
}

export function ProgressBar({ usedMinutes, totalTimeInMinutes }: ProgressBarProps) {
	const progress = Math.min((usedMinutes / totalTimeInMinutes) * 100, 100);
	const formatHours = (minutes: number): string => {
		const hours = minutes / 60;
		return hours % 1 === 0 ? `${hours}` : `${hours.toFixed(2)}`;
	};
	return (
		<div className="flex flex-col gap-2">
			<div className="w-full bg-gray-460 rounded-full h-2">
				<div
					className="bg-green-200 h-2 rounded-full transition-all duration-300 ease-in-out"
					style={{ width: `${progress}%` }}
				></div>
			</div>
			<div className="w-full flex justify-end">
				<label className="block font-primary text-[10px] text-white-100 font-medium uppercase overflow-hidden">
					<span className="line-clamp-1">
						{formatHours(usedMinutes)} HOURS Out of {formatHours(totalTimeInMinutes)} HOURS Used
					</span>
				</label>
			</div>
		</div>
	);
}
