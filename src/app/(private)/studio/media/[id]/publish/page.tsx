'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDla } from '@/contexts/dla.context';
import { InputFile } from '@/components/input-file.component';
import { Input } from '@/components/input.component';
import { SelectOption } from '@/components/select-option.component';
import { ToggleSelectionItem } from '@/components/toggle-selection-item.component';
import { useMedia } from '@/contexts/media.context';
import { NavBarpublishWidget } from '@/widgets/nav-bar-publish.widget';
import { Loader } from '@/components/loader/loader.component';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { VideoPlayer } from '@/components/video-player.component';
import { UploadMediaWidget } from '@/widgets/upload-media.widget';
import { InputTime } from '@/components/input-time.component';
import { IPublication } from '@/interfaces/publication.interface';
import { useMediaManager } from '@/contexts/media-manager.context';
import { MediaStatus } from '@/config/media-status.enum';
import { hhmmssToSeconds, secondsToHHMMSSMillisecond } from '@/utils/seconds-handler.util';
import { RadioGroup } from '@/components/radio-group/radio-group.component';
import { Rating } from '@/config/rating.config';
import { AddThumbnail } from '@/components/add-thumbnail/add-thumbnail.component';
import { AudienceMediaItem } from '@/components/audience-media-item.component';
import { PublicationType } from '@/config/publication-type.enum';
import { IWatch, IWatchPreview } from '@/interfaces/watch.interface';
import { useUpload } from '@/contexts/upload.context';
import { StripeConnect } from '@/components/stripe-connect.component';
import { ICompany } from '@/interfaces/company.interface';
import { VideoPlayerBasic } from '@/components/video-player-basic.component';

export default function PublishPage() {
	const router = useRouter();
	const upload = useUpload();
	const { media } = useMedia();
	const { monitorStatus, updateStatusOnPublication } = useMediaManager();
	const { PublicationService, CompanyService } = useDla();
	const [displayName, setDisplayName] = useState(false);
	const [subHeader, setSubHeader] = useState(false);
	const [showRating, setShowRating] = useState(false);
	const [companyLogo, setCompanyLogo] = useState(false);
	const [playableSegment, setPlayableSegment] = useState(false);
	const [saveInProgress, setSaveInProgress] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [showError, setShowError] = useState(false);
	const [formData, setFormData] = useState<any>(createDefaultFormDataObject());
	const [uploadImageModel, setUploadImageModel] = useState(false);
	const [playableSegmentError, setPlayableSegmentError] = useState<string>();
	const [displayNameError, setDisplayNameError] = useState<string>();
	const [subHeaderError, setSubHeaderError] = useState<string>();
	const [priceError, setPriceError] = useState<string>();
	const [contentInfo, setContentInfo] = useState<any>({});
	const [segmentStart, setSegmentStart] = useState('00:00:00:000');
	const [segmentEnd, setSegmentEnd] = useState('00:00:00:000');
	const [previewData, setPreviewData] = useState<IWatchPreview>();
	const [companyLogoFile, setCompanyLogoFile] = useState<File>();
	const [companyLogoSrc, setCompanyLogoSrc] = useState<any>();
	const [companyLogoName, setCompanyLogoName] = useState<string>();
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [company, setCompany] = useState<ICompany>();

	function createDefaultFormDataObject() {
		return {
			mediaId: media.id,
			type: PublicationType.PAID,
			overlay: createDefaultOverlayObject(),
			playout: createDefaultPlayOutObject(),
			authentication: true,
			listable: true,
			price: 0,
			thumbnail: media.cfThumbnail
		};
	}

	function createDefaultOverlayObject() {
		return {
			displayName: media.metadata?.title || media.name,
			showCompanyLogoDuringVideo: false
		};
	}

	function createDefaultPlayOutObject() {
		return {
			autoPlay: false
		};
	}

	function checkFormErrors(force = false): boolean {
		if (submitted || force) {
			let showError = false;

			if (playableSegment) {
				const start = formData.playout?.segmentStart;
				const end = formData.playout?.segmentEnd;
				const diffInSeconds = end - start;

				if (start >= end) {
					setPlayableSegmentError('Invalid field values');
					showError = true;
				} else if (diffInSeconds <= 4) {
					setPlayableSegmentError('The segment must be longer than 4 seconds');
					showError = true;
				}
			} else {
				setPlayableSegmentError(undefined);
			}

			if (
				displayName &&
				(!formData.overlay.displayName || formData.overlay.displayName.length === 0)
			) {
				setDisplayNameError('This field is mandatory');
				showError = true;
			} else {
				setDisplayNameError(undefined);
			}

			if (subHeader && (!formData.overlay.subHeader || formData.overlay.subHeader.length === 0)) {
				setSubHeaderError('This field is mandatory');
				showError = true;
			} else {
				setSubHeaderError(undefined);
			}

			if (formData.type === PublicationType.PAID && formData.price <= 0) {
				setPriceError('This field is mandatory');
				showError = true;
			} else {
				setPriceError(undefined);
			}

			return showError;
		}

		return false;
	}

	async function handleSubmit() {
		setSubmitted(true);
		if (!checkFormErrors(true)) {
			setSaveInProgress(true);

			const overlay = {
				...formData.overlay
			};

			if (companyLogoFile) {
				const fileExt = companyLogoFile.name.split('.').pop();
				const companyLogoTimestamp = new Date().getTime();
				// const asset = await upload.save({
				// 	data: { mediaId: media.id },
				// 	asset: 'company',
				// 	files: [
				// 		{
				// 			name: `${companyLogoTimestamp}.${fileExt}`,
				// 			path: `company/${companyLogoTimestamp}.${fileExt}`,
				// 			mime_type: companyLogoFile.type,
				// 			size: companyLogoFile.size,
				// 			data: companyLogoFile
				// 		}
				// 	]
				// });
				// overlay.companyLogo = `/q/${media.cfObjectId}/meta/public/asset_metadata/company/${asset.index}`;
				const asset = await upload.uploadS3(companyLogoFile);
				overlay.companyLogo = asset;
			}

			PublicationService.create({
				mediaId: formData.mediaId,
				type: formData.type,
				authentication: formData.authentication,
				listable: formData.listable,
				price: formData.price,
				thumbnail: formData.thumbnail,
				...formData.playout,
				...overlay
			})
				.then((data: IPublication) => {
					monitorStatus([
						{
							id: data.mediaId,
							name: media.metadata?.title || media.name,
							status: MediaStatus.PUBLICATION_IN_PROGRESS,
							mediaId: data.mediaId,
							publicationId: data.id
						}
					]);
					updateStatusOnPublication(data.mediaId, MediaStatus.PUBLISHED);
					router.push('/studio/publications-catalogue', { scroll: false });
				})
				.catch((error) => {
					setSaveInProgress(false);
					setShowError(true);
				});
		}
	}

	// useEffect(() => {
	// 	if (playableSegment) {
	// 		setFormData({
	// 			...formData,
	// 			playout: {
	// 				...formData.playout,
	// 				segmentStart: segmentStart,
	// 				segmentEnd: segmentEnd
	// 			}
	// 		});
	// 	}
	// }, [segmentStart, segmentEnd]);

	useEffect(() => {
		checkFormErrors();
		setPreviewData({
			id: media.id,
			type: formData.type,
			displayName: formData.overlay.displayName,
			subHeader: formData.overlay.subHeader,
			rating: formData.overlay.rating,
			companyLogo: companyLogoSrc,
			authentication: formData.authentication,
			price: formData.price,
			thumbnail: formData.thumbnail,
			views: 0
		});
	}, [formData, companyLogoFile]);

	useEffect(() => {
		if (!companyLogo) {
			setCompanyLogoFile(undefined);
			setCompanyLogoSrc(undefined);
			setCompanyLogoName(undefined);
			setContentInfo({
				...contentInfo,
				companyLogo: null
			});
			setFormData({
				...formData,
				overlay: {
					...formData.overlay,
					companyLogo: null
				}
			});
		}
	}, [companyLogo]);

	useEffect(() => {
		CompanyService.getById(media.companyId)
			.then((company: ICompany) => {
				setFetchInProgress(false);
				setCompany(company);
			})
			.catch((error) => {
				setFetchInProgress(false);
				setShowError(true);
			});
	}, []);

	return (
		<>
			<ErrorModelWidget
				isOpen={showError}
				handleAction={() => setShowError(false)}
				handleClose={() => setShowError(false)}
				action="Close"
				description="Sorry, there was an error saving the data."
			/>

			{saveInProgress && (
				<div className="fixed w-full h-full top-0 left-0 right-0 z-50">
					<Loader backdrop={true} />
				</div>
			)}

			{fetchInProgress && (
				<div className="fixed w-full h-full top-0 left-0 right-0">
					<Loader backdrop={true} />
				</div>
			)}

			{!showError && !fetchInProgress && company && (
				<>
					<div className="fixed top-0 left-0 right-0 z-10">
						<NavBarpublishWidget media={media} submit={handleSubmit} />
					</div>
					<div className="w-full pt-[75px]">
						<div className="flex">
							<div className="w-1/3 pl-5 pt-5">
								<div className="w-full bg-white-10 rounded-[8px] px-[20px] mb-5">
									<p className="font-primary font-normal text-[16px] text-white-100 uppercase pt-5">
										Access
									</p>
									<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
									<div className="flex flex-col pb-5">
										<div className="w-full">
											<RadioGroup
												label="Paid content"
												description={
													company.stripeOnboarding
														? 'Viewers are required a greenfish account to pay for the video.'
														: 'A Stripe account is required to receive revenue from GREENFISH.'
												}
												name="access"
												value={PublicationType.PAID}
												selected={formData.type}
												onChange={(value: string) =>
													setFormData({
														...formData,
														type: value,
														authentication: true
													})
												}
											/>
										</div>
										{formData.type === PublicationType.PAID && (
											<>
												{/* {!company.stripeOnboarding && (
													<div className="flex pl-[30px] pt-[8px]">
														<StripeConnect company={company} hiddenLabel />
													</div>
												)} */}
												{!company.stripeOnboarding && (
													<>
														<div className="flex pl-[30px] pt-[8px]">
															<div className="w-[100px]">
																<SelectOption
																	border={true}
																	label="Currency"
																	placeholder="Select the currency"
																	options={[
																		{
																			label: 'USD',
																			value: 'USD'
																		}
																	]}
																	onChange={(value: any) => {
																		setFormData({
																			...formData,
																			overlay: {
																				...formData.overlay,
																				rating: value[0]
																			}
																		});
																	}}
																	value={['USD']}
																/>
															</div>

															<div className="w-full pl-[8px]">
																<Input
																	placeholder="Price"
																	label="Price"
																	typeof="number"
																	border={true}
																	value={formData.price}
																	onChange={(value: string) => {
																		setFormData({
																			...formData,
																			price: parseFloat(value)
																		});
																	}}
																	error={priceError}
																/>
															</div>
														</div>
														<div className="flex w-full font-primary font-normal text-[10px] text-gray-300 uppercase pl-[30px] pt-[8px]">
															Only USD is available at the moment. More currencies coming soon.
														</div>
													</>
												)}
											</>
										)}
										<div className="w-full pt-[28px]">
											<RadioGroup
												label="Free to watch"
												name="access"
												value={PublicationType.FREE}
												selected={formData.type}
												onChange={(value: string) =>
													setFormData({
														...formData,
														type: value
													})
												}
											/>
										</div>
										{formData.type === PublicationType.FREE && (
											<>
												<div className="w-full pt-[18px] pl-[35px]">
													<RadioGroup
														label="Hiway login required"
														name="authentication"
														value={1}
														selected={formData.authentication ? 1 : 0}
														onChange={(value: number) =>
															setFormData({
																...formData,
																authentication: true
															})
														}
													/>
												</div>
												<div className="w-full pt-[18px] pl-[35px]">
													<RadioGroup
														label="No login required"
														name="authentication"
														value={0}
														selected={formData.authentication ? 1 : 0}
														onChange={(value: number) =>
															setFormData({
																...formData,
																authentication: false
															})
														}
													/>
												</div>
											</>
										)}
									</div>
								</div>

								<div className="w-full bg-white-10 rounded-[8px] px-[20px] mb-5">
									<p className="font-primary font-normal text-[16px] text-white-100 uppercase pt-5">
										Visibility
									</p>
									<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
									<p className="font-primary font-normal text-[14px] text-white-100 w-full pb-[16px]">
										Show in calalogue?
									</p>
									<div className="flex pb-5">
										<div className="pr-[50px]">
											<RadioGroup
												label="Yes"
												name="visibility"
												value={1}
												selected={formData.listable ? 1 : 0}
												onChange={(value: string) =>
													setFormData({
														...formData,
														listable: true
													})
												}
											/>
										</div>
										<div className="w-[full]">
											<RadioGroup
												label="No"
												name="visibility"
												value={0}
												selected={formData.listable ? 1 : 0}
												onChange={(value: string) =>
													setFormData({
														...formData,
														listable: false
													})
												}
											/>
										</div>
									</div>
								</div>

								<div className="w-full bg-white-10 rounded-[8px] px-[20px]">
									<p className="font-primary font-normal text-[16px] text-white-100 uppercase pt-5">
										Customise optional Play-out instructions
									</p>
									<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
									<div className="flex flex-col pb-5">
										<ToggleSelectionItem
											title="Show Display Name"
											subtitle={`${displayName ? formData.overlay.displayName?.length : 0}/50 characters`}
											isOn={displayName}
											onClick={() => {
												setDisplayName(!displayName);
												setFormData({
													...formData,
													overlay: {
														...formData.overlay,
														displayName: media.metadata?.title || media.name
													}
												});
												setContentInfo({
													...contentInfo,
													title: !displayName ? media.metadata?.title || media.name : undefined
												});
											}}
										/>
										{displayName && (
											<div className="pt-[8px]">
												<Input
													maxLength={50}
													hideMaxLength={true}
													placeholder="Video Name"
													hidelabel
													typeof="text"
													border={true}
													value={formData.overlay.displayName}
													onChange={(value: any) => {
														setFormData({
															...formData,
															overlay: {
																...formData.overlay,
																displayName: value
															}
														});
														setContentInfo({
															...contentInfo,
															title: value
														});
													}}
													error={displayNameError}
												/>
											</div>
										)}
										<ToggleSelectionItem
											className="pt-[18px]"
											title="Show Sub Header"
											subtitle={`${formData.overlay.subHeader?.length || 0}/70 characters`}
											isOn={subHeader}
											onClick={() => {
												setSubHeader(!subHeader);
												setFormData({
													...formData,
													overlay: {
														...formData.overlay,
														subHeader: null
													}
												});
												setContentInfo({
													...contentInfo,
													subtitle: null
												});
											}}
										/>
										{subHeader && (
											<div className="pt-[8px]">
												<Input
													maxLength={70}
													hideMaxLength={true}
													placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
													hidelabel
													typeof="text"
													border={true}
													onChange={(value: any) => {
														setFormData({
															...formData,
															overlay: {
																...formData.overlay,
																subHeader: value
															}
														});
														setContentInfo({
															...contentInfo,
															subtitle: value
														});
													}}
													error={subHeaderError}
												/>
											</div>
										)}

										<ToggleSelectionItem
											className="pt-[18px]"
											title="Show Rating"
											subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
											isOn={showRating}
											onClick={() => {
												setShowRating(!showRating);
												setFormData({
													...formData,
													overlay: {
														...formData.overlay,
														rating: null
													}
												});
												setContentInfo({
													...contentInfo,
													rating: null
												});
											}}
										/>

										{showRating && (
											<div className="pt-[8px]">
												<SelectOption
													border={true}
													label="Choose Rating"
													placeholder="Select the rating you want to showcase"
													options={Rating}
													onChange={(value: any) => {
														setFormData({
															...formData,
															overlay: {
																...formData.overlay,
																rating: value[0]
															}
														});
														setContentInfo({
															...contentInfo,
															rating: value[0]
														});
													}}
													value={[media.metadata?.rating || '']}
												/>
											</div>
										)}

										<ToggleSelectionItem
											className="pt-[18px]"
											title="Show company logo"
											isOn={companyLogo}
											onClick={() => {
												setCompanyLogo(!companyLogo);
											}}
										/>
										{companyLogo && (
											<div className="flex flex-col pt-[8px]">
												<InputFile
													id="company-logo-input"
													border={true}
													label="Company Logo"
													accept="image/*, image/gif, image/jpeg"
													changeButtonText="Change"
													src={companyLogoSrc}
													name={companyLogoName}
													onTrigger={() => setUploadImageModel(true)}
													onChange={(file: File) => {}}
													remove={() => setCompanyLogoFile(undefined)}
												/>
												<UploadMediaWidget
													title="Company Logo"
													isOpen={uploadImageModel}
													handleClose={() => setUploadImageModel(false)}
													multiple={false}
													accept="image/*, image/gif, image/jpeg"
													filesSelected={(files: File[]) => {
														setCompanyLogoFile(files[0]);
														setCompanyLogoSrc(URL.createObjectURL(files[0]));
														setUploadImageModel(false);
														setCompanyLogoName(files[0].name);
														setContentInfo({
															...contentInfo,
															companyLogo: URL.createObjectURL(files[0])
														});
													}}
												></UploadMediaWidget>
											</div>
										)}

										<ToggleSelectionItem
											className="pt-[18px]"
											title="Customize your playable segment"
											subtitle="To customize your playable segment you should firstly select on player either left “[” (if you want set up start time) or right “]” (if you want set up end time) square brackets."
											isOn={playableSegment}
											onClick={() => {
												const data = { ...formData };
												delete data.playout.segmentStart;
												delete data.playout.segmentEnd;
												setPlayableSegment(!playableSegment);
												setFormData(data);
											}}
										/>
										{playableSegment && (
											<div className="flex w-full pt-[8px]">
												<InputTime
													label="start time"
													border={true}
													placeholder="00:00:00:000"
													value={segmentStart}
													disabled
													onChange={(value: any) => {}}
													error={playableSegmentError}
												/>
												<div className="p-2" />
												<InputTime
													label="end time"
													border={true}
													placeholder="00:00:00:000"
													value={segmentEnd}
													disabled
													onChange={(value: any) => {}}
													error={playableSegmentError}
													hideErrorMessage
												/>
											</div>
										)}
									</div>
								</div>
								<div className="pb-5" />
							</div>
							<div className="w-2/3 p-5">
								<div className="overflow-hidden rounded-[8px] top-[90px] border-2 border-white-10">
									{/* <VideoPlayer
										token={media.token || ''}
										versionHash={media.cfMasterHash || ''}
										offering="default"
										autoplay={false}
										controls={{
											markInOut: playableSegment,
											previewMode: true,
											markInOutCallback: (values: { in: number; out: number }) => {
												setSegmentStart(secondsToHHMMSSMillisecond(values.in));
												setSegmentEnd(secondsToHHMMSSMillisecond(values.out));
											}
										}}
										contentInfo={contentInfo}
									/> */}
									<VideoPlayerBasic
										videoUrl={media.fileUrl || ''}
										autoplay={false}
										controls={{
											markInOut: playableSegment,
											previewMode: true,
											markInOutCallback: (values: { in: number; out: number }) => {
												console.log(values);
												setSegmentStart(secondsToHHMMSSMillisecond(values.in));
												setSegmentEnd(secondsToHHMMSSMillisecond(values.out));
												setFormData({
													...formData,
													playout: {
														...formData.playout,
														segmentStart: values.in,
														segmentEnd: values.out
													}
												});
											}
										}}
										contentInfo={contentInfo}
									/>
								</div>

								<div className="w-full bg-white-10 rounded-[8px] px-[20px] mt-5">
									<p className="font-primary font-normal text-[16px] text-white-100 uppercase pt-5">
										Presentation
									</p>
									<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
									<div className="flex flex-col pb-5">
										<div className="grid grid-cols-2">
											<div className="w-full">
												<div className="pr-[20px] pb-[20px]">
													<p className="font-primary font-normal text-[14px] text-white-100">
														Select Background
													</p>
													<p className="font-primary font-normal text-[10px] text-gray-300 uppercase max-w-[450px]">
														Select or upload a picture that shows what is in your video. A good
														thumbnail stands out and draws viewers attention.Lorem ipsum dolor sit
														amet
													</p>
												</div>
												<AddThumbnail
													media={media}
													title="All backgrounds"
													uploadModalTitle="Upload thumbnail"
													buttonText="Set as background"
													selectedSrc={formData.thumbnail}
													onChange={(src: string) => {
														setFormData({
															...formData,
															thumbnail: src
														});
													}}
												/>
											</div>
											<div className="w-full flex justify-end">
												<div className="w-[500px]">
													<div className="pr-[20px] pb-[20px]">
														<p className="font-primary font-normal text-[14px] text-white-100">
															Background Preview
														</p>
														<p className="font-primary font-normal text-[10px] text-gray-300 uppercase max-w-[450px]">
															Mobile preview
														</p>
													</div>
													{previewData && (
														<AudienceMediaItem data={previewData} previewMode={true} />
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}
