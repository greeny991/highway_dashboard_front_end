'use client';

import { AssetInfoItem } from '@/components/asset-info-item.component';

export function AssetSpecificationsWidget() {
	const languages = [
		{ flag: 'us', language: 'English' },
		{ flag: 'fr', language: 'French' },
		{ flag: 'es', language: 'Spanish' }
	];
	return (
		<div className="">
			<p className="font-primary font-normal text-[16px] lg:text-[18px] text-white-100 uppercase  pt-4">
				Asset Specifications
			</p>
			<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
			<div className="flex flex-col gap-4">
				<AssetInfoItem title="File Type" value="Video" />
				<AssetInfoItem title="Format" value="mp4" />
				<AssetInfoItem title="Video Size" value="720x480" />
				<AssetInfoItem title="Library" value="Acme Inc. library" />
				<AssetInfoItem title="Original Language" languages={languages} />
			</div>
		</div>
	);
}
