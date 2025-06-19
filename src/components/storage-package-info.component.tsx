'use client';

import { ProgressBar } from './progress-bar.component';

export function StoragePackageInfo() {
	return (
		<div className="flex flex-col gap-4">
			<div className="font-primary text-[16px] leading-[18.75px] text-white-100 font-medium uppercase overflow-hidden">
				Storage
			</div>
			<label className="block font-primary text-[10px] text-white-100 font-medium uppercase overflow-hidden">
				<span style={{ whiteSpace: 'pre-line' }}>
					You‘ve used 0.30 hours of storage space, out of 100 total hours available.{'\n'}
					You can request more space at no additional cost when you have less than 15 hours of space
					left.
				</span>
			</label>
			<ProgressBar usedMinutes={100} totalTimeInMinutes={900} />
		</div>
	);
}
