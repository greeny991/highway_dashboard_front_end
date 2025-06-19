'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/loader/loader.component';
import { VideoPlayer } from '@/components/video-player.component';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { useDla } from '@/contexts/dla.context';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { TagItem } from '@/components/tag-item.component';
import { NavBarWatchWidget } from '@/widgets/nav-bar-watch.widget';
import { AudienceDropdown } from '@/components/audience-dropdown/audience-dropdown.component';
import { IWatch } from '@/interfaces/watch.interface';
import { AuthenticationModalWidget } from '@/widgets/authentication-modal.widget';
import { formatCurrencyAmount } from '@/utils/format-currency-amount.util';
import { InlineLoader } from '@/components/inline-loader/inline-loader.component';
import { ByButton } from '@/components/by-button.component';

export default function WatchDetailsPage(props: any) {
	const router = useRouter();
	const { PublicationService, WatchService } = useDla();
	const dropdownTrigger = useRef<any>(null);
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [accessToken, setAccessToken] = useState<string>();
	const [showPlayer, setShowPlayer] = useState(true);
	const [showError, setShowError] = useState(false);
	const [playerIsReady, setPlayerIsReady] = useState(true);
	const [data, setData] = useState<IWatch>();
	const [showDropdownOptions, setShowDropdownOptions] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [createTokenStatus, setCreateTokenStatus] = useState<number>();

	function removeURLParams() {
		const url = new URL(window.location.href);
		url.search = '';
		window.history.pushState({}, '', url.toString());
	}

	function generateStripeCheckout() {
		const watchData = data as IWatch;

		setCreateTokenStatus(undefined);
		PublicationService.createCheckoutLink(watchData.id)
			.then((data: { url: string }) => {
				window.open(data.url, '_self');
			})
			.catch((error: any) => {
				setShowError(true);
			});
	}

	useEffect(() => {
		setFetchInProgress(true);
		WatchService.getById(props.params.id)
			.then((data: IWatch) => {
				setData(data);
				setFetchInProgress(false);
			})
			.catch((error: any) => {
				setFetchInProgress(false);
				setShowError(true);
			});

		const params = new URLSearchParams(window.location.search);
		const sid = params.get('sid') as string;
		// const service = sid
		// 	? PublicationService.checkCheckoutPayment(sid)
		// 	: WatchService.createAccessTokenByPublicationId(props.params.id);

		// service
		// 	.then((data: { token: string }) => {
		// 		setAccessToken(data.token);
		// 		setCreateTokenStatus(200);
		// 		removeURLParams();
		// 	})
		// 	.catch((error: any) => {
		// 		if (error.response.status === 403 || error.response.status === 401) {
		// 			setCreateTokenStatus(error.response.status);
		// 		} else {
		// 			setShowError(true);
		// 		}
		// 	});
	}, []);

	return (
		<>
			<ErrorModelWidget
				isOpen={showError}
				handleAction={() => router.push('/', { scroll: false })}
				handleClose={() => router.push('/', { scroll: false })}
				action="Try again later"
				description="Sorry, this video cannot be viewed now."
			/>

			{fetchInProgress && (
				<div className="fixed w-full h-full top-0 left-0 right-0 z-50">
					<Loader />
				</div>
			)}

			{!fetchInProgress && !showError && data && (
				<>
					<div className="fixed top-0 left-0 right-0 z-10">
						<NavBarWatchWidget />
					</div>
					<div className="relative z-9 w-full h-full">
						{!playerIsReady && (
							<img
								// src={`${process.env.NEXT_PUBLIC_CONTENT_FABRIC_BASE_URL_STATICS}${data.thumbnail}?width=1920`}
								src={data.cfThumbnail}
								className="absolute z-0 w-full h-full object-cover"
							/>
						)}
						<div className="h-full w-full bg-gradient-to-b from-black to-transparent absolute z-1" />

						{showPlayer && (
							<>
								<div className="fixed top-0 left-0 w-full h-full z-9 bg-black opacity-55"></div>
								<div className="w-full h-full relative top-0 left-0 pt-[75px] z-8">
									{/* <VideoPlayer
										token={accessToken || ''}
										versionHash={data.hash as string}
										offering={data.offering as string}
										autoplay={true}
										controls={{
											markInOut: false,
											previewMode: false
										}}
										contentInfo={{
											title: data.displayName,
											subtitle: data.subHeader,
											companyLogo: data.companyLogo
												? `${process.env.NEXT_PUBLIC_CONTENT_FABRIC_BASE_URL_STATICS}${data.companyLogo}?width=150`
												: undefined,
											rating: data.rating
										}}
										onReady={() => setPlayerIsReady(true)}
									/> */}
									<video
										src={data.fileUrl}
										className="w-full h-full object-cover"
										controls
										onLoadedData={() => setPlayerIsReady(true)}
									/>
								</div>
							</>
						)}

						{!showPlayer && (
							<div className="relative w-full h-full mt-[75px] xl:mt-0 flex flex-col justify-center gap-2 xl:gap-4 py-4 px-4 xl:px-8 z-2">
								<div className="flex flex-row items-center gap-2">
									<div className="w-[17.09px] h-[17.09px] xl:w-[22px] xl:h-[22px] border border-white-100 rounded-full bg-[url('/images/landing-bg.png')] bg-cover bg-center" />
									<p className="font-primary font-bold text-[12px] xl:text-[16px] leading-[14.06px] xl:leading-[18.75px] text-white-100 uppercase">
										FLMCRW
									</p>
								</div>
								<p className="font-primary font-bold xl:text-[48px] text-[32px] leading-[36px] xl:text-white-100 text-white-100 uppercase">
									{data.displayName}
								</p>
								<p className="font-primary block text-[14px] xl:text-[16px] leading-[20px] text-white-100 font-normal">
									{data.subHeader}
								</p>

								<div className="flex flex-wrap gap-4 items-center">
									<p className="font-primary block text-[12px] xl:text-[14px] leading-[12px] xl:leading-[14px] text-white-100 font-normal">
										<span className="inline-block pr-[10px]">2h</span>|
										<span className="inline-block pl-[10px] pr-[10px]">2018</span>|
										<span className="inline-block pl-[10px]">40k views</span>
									</p>
									<div className="flex flex-wrap gap-4">
										<TagItem value="PG" />
										<TagItem value="HD" />
									</div>
								</div>

								<div className="flex flex-wrap gap-4">
									<TagItem value="Action" isGenre />
									<TagItem value="Drama" isGenre />
								</div>

								<div className="flex flex-row items-center gap-2 pt-4">
									{(data.price === 0 || createTokenStatus === 200) && (
										<Button
											disabled={!createTokenStatus}
											type="tertiary"
											iconColorType="primary-dark"
											className="!h-[48px] !text-[16px] !xl:text-[20px]"
											onClick={() => {
												if (createTokenStatus === 200) setShowPlayer(true);
												if (data.authentication && createTokenStatus === 401)
													setShowLoginModal(true);
											}}
										>
											{!createTokenStatus && (
												<span className="pr-3">
													<InlineLoader size="small" />
												</span>
											)}
											Watch Now
										</Button>
									)}

									{data.price > 0 && createTokenStatus !== 200 && (
										<ByButton
											price={formatCurrencyAmount(data.price, 'USD')}
											disabled={!createTokenStatus}
											onClick={() => {
												if (createTokenStatus === 401) setShowLoginModal(true);
												if (createTokenStatus === 403) generateStripeCheckout();
											}}
										>
											<span className="flex items-center">
												{!createTokenStatus && (
													<span className="pr-3">
														<InlineLoader size="small" />
													</span>
												)}
												Watch Now
											</span>
										</ByButton>
									)}

									<div className="relative">
										<AudienceDropdown
											trigger={dropdownTrigger}
											changeState={(isOpened) => setShowDropdownOptions(isOpened)}
											position="top-12"
											items={[
												{
													name: 'Share',
													asset: 'share',
													click: () => {}
												},
												{ name: 'Add to playlist', asset: 'audience-play', click: () => {} },
												{
													name: 'Watch later',
													asset: 'watch-later',
													click: () => {}
												},
												{ name: 'More details', asset: 'details', click: () => {} },
												{ name: 'Report', asset: 'report', click: () => {} }
											]}
										/>
										<div className=" rotate-90">
											<button type="button" ref={dropdownTrigger}>
												<Icon
													name="ellipsis"
													size="large"
													className={`
                            rounded-[8px] my-2
                            ${showDropdownOptions ? 'bg-yellow-900 fill-gray-925' : 'fill-white-100 hover:bg-yellow-900 hover:fill-gray-925'}
                          `}
												/>
											</button>
										</div>
									</div>
									<Icon
										name="heart"
										size="medium"
										className="p-[4px] fill-white-100 hover:fill-yellow-900 hover:cursor-pointer"
									/>
								</div>
							</div>
						)}
					</div>
				</>
			)}

			<AuthenticationModalWidget
				isOpen={showLoginModal}
				handleClose={(reload: boolean) => {
					if (reload) window.location.reload();
					else setShowLoginModal(false);
				}}
			></AuthenticationModalWidget>
		</>
	);
}
