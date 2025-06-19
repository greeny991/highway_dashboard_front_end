'use client';

import { useEffect, useState } from 'react';
import { TabBar } from '@/components/tab-bar.component';
import { VideoPlayer } from '@/components/video-player.component';
import { AnalyticsWidget } from '@/widgets/analytics.widget';
import { AssetSpecificationsWidget } from '@/widgets/asset-specifications.widget';
import { EditorialMetadataWidget } from '@/widgets/editorial-metadata.widget';
import { ListedPublishingsWidget } from '@/widgets/listed-publishings.widget';
import { VersionsWidget } from '@/widgets/versions.widget';
import { NavBarVideoPlayerWidget } from '@/widgets/nav-bar-video-player.widget';
import { useMedia } from '@/contexts/media.context';
import { IMediaAnalytics } from '@/interfaces/media-analytics.interface';
import { useDla } from '@/contexts/dla.context';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { VideoPlayerBasic } from '@/components/video-player-basic.component';

export default function ViewMediaPage() {
	const { media } = useMedia();
	const [selectedTab, setSelectedTab] = useState<number>(0);
	const [mediaAnalytics, setMediaAnalytics] = useState<IMediaAnalytics>({} as IMediaAnalytics);
	const { MediaService } = useDla();
	const { authenticator } = useAuthenticator();

	function fetchMediaAnalytics(): void {
		MediaService.getAnalyticsByMediaId({
			id: media.id,
			companyId: authenticator.user.companyId!
		}).then((data: IMediaAnalytics) => {
			setMediaAnalytics(data);
		});
	}

	useEffect(() => {
		fetchMediaAnalytics();
	}, []);

	return (
		<>
			<div className="fixed top-0 left-0 right-0 z-10">
				<NavBarVideoPlayerWidget media={media} />
			</div>
			<div className="static w-full h-full">
				<div className="w-full flex justify-center mt-[75px] pt-4">
					<div className="w-2/3 aspect-video flex flex-col overflow-hidden rounded-[8px] relative">
						{/* <VideoPlayer
							token={media.token}
							versionHash={media.cfMasterHash}
							offering="default"
							autoplay={false}
							controls={{
								markInOut: false,
								previewMode: false
							}}
						/> */}
						{/* <video src={media.fileUrl} className="w-full h-full object-cover" controls /> */}
						<VideoPlayerBasic
							videoUrl={media.fileUrl}
							autoplay={false}
							controls={{
								markInOut: false,
								previewMode: false
							}}
						/>
					</div>
				</div>
				<div className="w-full flex justify-center">
					<div className="w-2/3 flex flex-col">
						<TabBar
							active={selectedTab}
							click={(selected: number) => setSelectedTab(selected)}
							items={[
								{ title: 'Editorial Metadata', src: 'edit-info' },
								{ title: 'Asset Specifications', src: 'asset-spec' },
								{ title: 'Versions', src: 'versions' },
								{ title: 'All listed publications', src: 'publish' },
								{ title: 'Analytics', src: 'analytics' }
							]}
						/>
						<div className="p-2" />
						{selectedTab === 0 && <EditorialMetadataWidget media={media} />}
						{selectedTab === 1 && <AssetSpecificationsWidget />}
						{selectedTab === 2 && <VersionsWidget />}
						{selectedTab === 3 && <ListedPublishingsWidget />}
						{selectedTab === 4 && <AnalyticsWidget mediaAnalytics={mediaAnalytics} />}
						<div className="p-4" />
					</div>
				</div>
			</div>
		</>
	);
}
