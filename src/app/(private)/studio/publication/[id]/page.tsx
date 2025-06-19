'use client';

import { useEffect, useState } from 'react';
import { IWatch, IWatchPreview } from '@/interfaces/watch.interface';
import { PublishAnalyticsItem } from '@/components/publish-analytics-item.component';
import { SourceItem } from '@/components/source-item.component';
import { VideoPlayer } from '@/components/video-player.component';
import { AudienceMediaItem } from '@/components/audience-media-item.component';
import { usePublication } from '@/contexts/publication.context';
import { formatCurrencyAmount } from '@/utils/format-currency-amount.util';
import { formatNumberUnitsWithSuffix } from '@/utils/format-number-units-with-suffix.util';
import { useDla } from '@/contexts/dla.context';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { IPublicationAnalytics } from '@/interfaces/publication-analytics.interface';
import { VideoPlayerBasic } from '@/components/video-player-basic.component';
import { formatWatchTime } from '@/utils/format-watch-time';

export default function PublicationDetailPage() {
	const { publication } = usePublication();
	const [previewData, setPreviewData] = useState<IWatchPreview>({
		id: publication.id,
		type: publication.type,
		displayName: publication.displayName,
		subHeader: publication.subHeader,
		rating: publication.rating,
		companyLogo: publication.companyLogo,
		authentication: publication.authentication,
		price: publication.price,
		thumbnail: publication.thumbnail,
		views: 0
	});
	const [publicationAnalytics, setPublicationAnalytics] = useState<IPublicationAnalytics>(
		{} as IPublicationAnalytics
	);
	const { PublicationService } = useDla();
	const { authenticator } = useAuthenticator();

	function fetchPublicationAnalytics(): void {
		PublicationService.getAnalyticsByPublicationId(publication.id).then(
			(data: IPublicationAnalytics) => {
				setPublicationAnalytics(data);
			}
		);
	}

	useEffect(() => {
		fetchPublicationAnalytics();
	}, []);

	return (
		<div className="w-full pt-[75px] flex">
			<div className="flex-1 p-4 w-max-[550px] max-w-[550px]">
				<div className="flex items-center justify-between cursor-pointer pt-4">
					<p className="font-primary font-normal text-[16px] text-white-100 uppercase">
						Monetisation
					</p>
				</div>
				<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
				<div>
					<PublishAnalyticsItem
						title="Total earnings"
						scr="money"
						value={
							publicationAnalytics.totalEarnings !== undefined
								? formatCurrencyAmount(publicationAnalytics.totalEarnings, 'USD')
								: '-'
						}
						change={
							publicationAnalytics.earningsChange !== undefined
								? publicationAnalytics.earningsChange > 0
									? '+' + publicationAnalytics.earningsChange.toString()
									: publicationAnalytics.earningsChange.toString()
								: '-'
						}
						colorTheme="secondary"
					/>
				</div>
				<div className="flex items-center justify-between cursor-pointer pt-6">
					<p className="font-primary font-normal text-[16px] text-white-100 uppercase">
						Publishing Analytics
					</p>
				</div>
				<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />

				<div>
					<PublishAnalyticsItem
						title="Total views"
						scr="views"
						value={
							publicationAnalytics.totalViews !== undefined
								? formatNumberUnitsWithSuffix(publicationAnalytics.totalViews)
								: '-'
						}
						change={
							publicationAnalytics.viewsChange !== undefined
								? publicationAnalytics.viewsChange > 0
									? '+' + publicationAnalytics.viewsChange.toString()
									: publicationAnalytics.viewsChange.toString()
								: '-'
						}
						colorTheme="primary"
					/>
					<div className="p-2" />
					<PublishAnalyticsItem
						title="Total watch time"
						scr="play"
						value={
							publicationAnalytics.totalWatchTime !== undefined
								? formatWatchTime(publicationAnalytics.totalWatchTime)
								: '-'
						}
						change={
							publicationAnalytics.watchTimeChange !== undefined
								? publicationAnalytics.watchTimeChange > 0
									? '+' + publicationAnalytics.watchTimeChange.toString()
									: publicationAnalytics.watchTimeChange.toString()
								: '-'
						}
						colorTheme="primary"
					/>
				</div>
				<div className="flex items-center justify-between cursor-pointer pt-6">
					<p className="font-primary font-normal text-[16px] text-white-100 uppercase">
						Audience Preview
					</p>
				</div>
				<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
				<AudienceMediaItem data={previewData} previewMode={true} />
				<div className="flex items-center justify-between cursor-pointer pt-6">
					<p className="font-primary font-normal text-[16px] text-white-100 uppercase">Source</p>
				</div>
				<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
				<SourceItem publication={publication} />
			</div>
			<div className="flex-1 p-4">
				<div className="overflow-hidden rounded-[8px] sticky top-[90px]">
					<VideoPlayerBasic
						videoUrl={publication.media.fileUrl}
						autoplay={false}
						controls={{
							markInOut: false,
							previewMode: false
						}}
					/>
					{/* <VideoPlayer
						token={publication.signedToken || ''}
						versionHash={publication.cfMezzanineHash}
						offering={publication.id}
						autoplay={false}
						controls={{
							markInOut: false,
							previewMode: false
						}}
					/> */}
				</div>
			</div>
		</div>
	);
}
