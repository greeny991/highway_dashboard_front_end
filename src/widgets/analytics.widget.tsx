'use client';

import { AnalyticsItem } from '@/components/analytics-item.component';
import { IMediaAnalytics } from '@/interfaces/media-analytics.interface';
import { numberToPercentage } from '@/utils';
import { formatNumberUnitsWithSuffix } from '@/utils/format-number-units-with-suffix.util';
import { secondsToHHMMSS } from '@/utils/seconds-handler.util';

type Props = {
	mediaAnalytics: IMediaAnalytics;
};

export function AnalyticsWidget({ mediaAnalytics }: Props) {
	return (
		<div className="">
			<p className="font-primary font-normal text-[16px] lg:text-[18px] text-white-100 uppercase pt-4">
				Analytics
			</p>
			<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
			<div className="flex gap-3">
				<AnalyticsItem
					title="Total views"
					scr="views"
					value={
						mediaAnalytics.totalViews ? formatNumberUnitsWithSuffix(mediaAnalytics.totalViews) : '-'
					}
					change={numberToPercentage(mediaAnalytics.viewsChange)}
				/>
				<AnalyticsItem
					title="Average view duration, sec"
					scr="clock"
					value={
						mediaAnalytics.averageViewDuration
							? secondsToHHMMSS(mediaAnalytics.averageViewDuration)
							: '-'
					}
					change={numberToPercentage(mediaAnalytics.viewDurationChange)}
				/>
				<AnalyticsItem
					title="Total watch time, h"
					scr="play"
					value={
						mediaAnalytics.totalWatchTime
							? formatNumberUnitsWithSuffix(mediaAnalytics.totalWatchTime)
							: '-'
					}
					change={numberToPercentage(mediaAnalytics.watchTimeChange)}
				/>
				<AnalyticsItem
					title="Unique viewers"
					scr="profile-round"
					value={
						mediaAnalytics.uniqueViewers
							? formatNumberUnitsWithSuffix(mediaAnalytics.uniqueViewers)
							: '-'
					}
					change={numberToPercentage(mediaAnalytics.uniqueViewersChange)}
				/>
			</div>
		</div>
	);
}
