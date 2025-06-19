'use client';

import { VersionItem } from '@/components/version-item.component';

export function VersionsWidget() {
	return (
		<div className="">
			<p className="font-primary font-normal text-[16px] lg:text-[18px] text-white-100 uppercase  pt-4">
				Versions
			</p>
			<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
			<div className="flex flex-col gap-1">
				<VersionItem title="Some Title" subtitle="Some S«thing here" current />
				<VersionItem title="Some Title" subtitle="Some S«thing here" />
				<VersionItem title="Some Title" subtitle="Some S«thing here" />
			</div>
		</div>
	);
}
