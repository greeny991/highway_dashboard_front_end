'use client';

import { ListedPublicationsItem } from '@/components/listed-publications-item.component';

export function ListedPublishingsWidget() {
	return (
		<div className="">
			<p className="font-primary font-normal text-[16px] lg:text-[18px] text-white-100 uppercase  pt-4">
				All Listed Publishings
			</p>
			<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
			<div className="flex flex-col gap-3">
				<ListedPublicationsItem scr="scr" title="Title" value="Value" />
				<ListedPublicationsItem scr="scr" title="Title" value="Value" />
				<ListedPublicationsItem scr="scr" title="Title" value="Value" />
			</div>
		</div>
	);
}
