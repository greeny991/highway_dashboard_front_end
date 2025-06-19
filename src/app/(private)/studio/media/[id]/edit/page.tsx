'use client';

import { z } from 'zod';
import { AddCrewItem } from '@/components/add-crew-item.component';
import { AddThumbnail } from '@/components/add-thumbnail/add-thumbnail.component';
import { InputChips } from '@/components/input-chips.component';
import { Input } from '@/components/input.component';
import { Loader } from '@/components/loader/loader.component';
import { SelectOption } from '@/components/select-option.component';
import { IMediaMetadata, IMedia } from '@/interfaces/media.interface';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { NavBarEditModeWidget } from '@/widgets/nav-bar-edit-mode.widget';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { InputDuration } from '@/components/input-duration.component';
import { DatePicker } from '@/components/date-picker/date-picker.component';
import { useMedia } from '@/contexts/media.context';
import { VideoPlayer } from '@/components/video-player.component';
import { Rating } from '@/config/rating.config';
import { Genre } from '@/config/genre.config';
import { ContentType } from '@/config/content-type.config';
import { EpisodicContentType } from '@/config/episodic-content-type.config';
import { toast } from 'react-toastify';

const formSchema = z
	.object({
		title: z.string().min(1, { message: 'This field is mandatory' }),
		description: z
			.string({ message: 'This field is mandatory' })
			.min(1, { message: 'This field is mandatory' }),
		contentType: z.string({ message: 'This field is mandatory' }),
		rating: z.string({ message: 'This field is mandatory' }),
		episodicContent: z.boolean({ message: 'This field is mandatory' }),
		seasonNumber: z.number().optional().nullable(),
		episodeNumber: z.number().optional().nullable(),
		duration: z
			.string({ message: 'This field is mandatory' })
			.min(1, { message: 'This field is mandatory' }),
		releaseDate: z.string({ message: 'This field is mandatory' }),
		originalLanguage: z.string({ message: 'This field is mandatory' }),
		genre: z.array(z.string({ message: 'This field is mandatory' })),
		cast: z.array(z.string({ message: 'This field is mandatory' })),
		productionCompany: z.string({ message: 'This field is mandatory' }),
		crew: z.array(
			z.object({
				position: z.string(),
				name: z.string()
			}),
			{ message: 'This field is mandatory' }
		)
	})
	.refine(
		(data) => {
			if (data.episodicContent) {
				return data.seasonNumber !== undefined && data.episodeNumber !== undefined;
			}
			return true;
		},
		{
			message: 'This field is mandatory',
			path: ['seasonNumber', 'episodeNumber']
		}
	);

export default function EditMediaPage() {
	const router = useRouter();
	const { save, media } = useMedia();
	const [showError, setShowError] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [formErrors, setFormErrors] = useState([]);
	const [saveInProgress, setSaveInProgress] = useState(false);
	const [releaseDate, setReleaseDate] = useState<Date>(new Date());
	const [formData, setFormData] = useState<IMediaMetadata>({} as IMediaMetadata);
	const [episodicContent, setEpisodicContent] = useState(false);

	function handleSubmit() {
		setSaveInProgress(true);
		setSubmitted(true);

		try {
			formSchema.parse(formData);
			console.log(formData);

			setFormErrors([]);
			save({ ...media, metadata: formData })
				.then((data: IMedia) => {
					setSaveInProgress(false);
					toast.success('Metadata updated successfully');
				})
				.catch((error) => {
					setSaveInProgress(false);
					setShowError(true);
				});
		} catch (e: any) {
			setSaveInProgress(false);
			console.log(e);
			setFormErrors(e.errors);
		}
	}

	function getError(name: string): string {
		const error: any = formErrors.find((error: any) => error.path.includes(name));
		return error ? error.message : '';
	}

	useEffect(() => {
		if (media) {
			setFormData(media.metadata as IMediaMetadata);
			if (media.metadata?.releaseDate) {
				setReleaseDate(new Date(Number(media.metadata?.releaseDate)));
			} else {
				setFormData({ ...formData, releaseDate: releaseDate.getTime().toString() });
			}
			if (media.metadata?.episodicContent) {
				setEpisodicContent(media.metadata?.episodicContent);
			}
		}
	}, [media]);

	useEffect(() => {
		if (submitted) {
			try {
				formSchema.parse(formData);
				setFormErrors([]);
			} catch (e: any) {
				setFormErrors(e.errors);
			}
		}
	}, [formData]);

	return (
		<>
			<ErrorModelWidget
				isOpen={showError}
				// handleAction={() => router.push('/studio/media-catalogue', { scroll: false })}
				// handleClose={() => router.push('/studio/media-catalogue', { scroll: false })}
				handleAction={() => {
					setShowError(false);
				}}
				handleClose={() => {
					setShowError(false);
				}}
				action="Try again later"
				description="Sorry, there was an error saving the data."
			/>

			{saveInProgress && (
				<div className="fixed w-full h-full top-0 left-0 right-0 z-50">
					<Loader backdrop={true} />
				</div>
			)}

			<>
				<div className="fixed top-0 left-0 right-0 z-10">
					<NavBarEditModeWidget media={media} submit={handleSubmit} />
				</div>
				<div className="w-full pt-[75px]">
					<div className="flex">
						<div className="w-1/3 p-4">
							<div className="rounded-[8px] overflow-hidden sticky top-[90px]">
								{/* <VideoPlayer
										token={media.token || ''}
										versionHash={media.cfMasterHash}
										offering="default"
										autoplay={false}
										controls={{
											markInOut: false,
											previewMode: false
										}}
									/> */}
								<video src={media.fileUrl} className="w-full h-full object-cover" controls />
							</div>
						</div>
						<div className="w-2/3 h-full p-4">
							<p className="font-primary font-normal text-[16px] text-white-100 uppercase pt-4">
								Content Details
							</p>
							<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
							<Input
								label="Library Title"
								placeholder="Video Name"
								maxLength={50}
								value={media.metadata?.title}
								onChange={(value: any) => {
									setFormData({ ...formData, title: value });
								}}
								error={getError('title')}
							/>
							<div className="p-2" />
							<Input
								label="Video Description"
								placeholder="Some video description here"
								textarea
								maxLength={4000}
								value={media.metadata?.description}
								onChange={(value: any) => {
									setFormData({ ...formData, description: value });
								}}
								error={getError('description')}
							/>
							<div className="p-2" />
							<p className="font-primary font-normal text-[16px] text-white-100 uppercase pt-4">
								Metadata
							</p>
							<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
							<div className="flex">
								<SelectOption
									label="Content Type"
									placeholder="Select Content Type"
									options={ContentType}
									onChange={(value: any) => {
										setFormData({ ...formData, contentType: value[0] });
									}}
									value={[media.metadata?.contentType || '']}
									error={getError('contentType')}
								/>
								<div className="p-2" />
								<SelectOption
									label="Rating"
									placeholder="Select Rating"
									options={Rating}
									onChange={(value: any) => {
										setFormData({ ...formData, rating: value[0] });
									}}
									value={[media.metadata?.rating || '']}
									error={getError('rating')}
								/>
							</div>
							<div className="p-2" />
							<div className="flex flex-row justify-evenly gap-4">
								<div className="flex w-full">
									<SelectOption
										label="Episodic Content"
										placeholder="Select Episodic Content Type"
										options={EpisodicContentType}
										onChange={(value: any) => {
											setFormData({ ...formData, episodicContent: value[0] === 'true' });
											setEpisodicContent(value[0] === 'true');
										}}
										value={[media.metadata?.episodicContent ? 'true' : 'false']}
										error={getError('episodicContent')}
									/>
								</div>
								<div className="flex w-full">
									{episodicContent && (
										<div className="flex w-full">
											<Input
												label="Season Number"
												placeholder="0"
												typeof="number"
												value={media.metadata?.seasonNumber}
												onChange={(value: any) => {
													setFormData({
														...formData,
														seasonNumber: value ? parseInt(value) : undefined
													});
												}}
												error={getError('seasonNumber')}
											/>
											<div className="p-2" />
											<Input
												label="Episode Number"
												placeholder="0"
												typeof="number"
												value={media.metadata?.episodeNumber}
												onChange={(value: any) => {
													setFormData({
														...formData,
														episodeNumber: value ? parseInt(value) : undefined
													});
												}}
												error={getError('episodeNumber')}
											/>
										</div>
									)}
								</div>
							</div>
							<div className="p-2" />
							<div className="flex">
								<InputDuration
									label="Duration"
									placeholder="0h 0m"
									value={media.metadata?.duration}
									onChange={(value: any) => {
										setFormData({ ...formData, duration: value });
									}}
									error={getError('duration')}
								/>
								<div className="p-2" />
								<div className="w-full">
									<DatePicker
										label="Release Date"
										value={releaseDate}
										onChange={(date) => {
											setReleaseDate(date);
											const timestamp = date.getTime().toString();
											setFormData({ ...formData, releaseDate: timestamp });
										}}
									/>
								</div>
							</div>
							<div className="p-2" />
							<div className="flex">
								<SelectOption
									label="Original Language"
									placeholder="Select Original Language"
									options={[
										{
											label: 'English - United States',
											value: 'en-us'
										},
										{
											label: 'English - United Kingdom',
											value: 'en-gb'
										}
									]}
									onChange={(value: any) => {
										setFormData({ ...formData, originalLanguage: value[0] });
									}}
									value={[media.metadata?.originalLanguage || '']}
									error={getError('originalLanguage')}
								/>
								<div className="p-2" />
								<SelectOption
									label="Genre"
									placeholder="Select Genre"
									multiSelection
									options={Genre}
									onChange={(value: any) => {
										setFormData({ ...formData, genre: value.map((v: any) => v) });
									}}
									value={media.metadata?.genre}
									error={getError('genre')}
								/>
							</div>
							<div className="p-2" />
							<InputChips
								label="Cast"
								placeholder="Add a new cast by pressing enter"
								value={media.metadata?.cast}
								onChange={(value: any) => {
									setFormData({ ...formData, cast: value });
								}}
								error={getError('cast')}
							/>
							<div className="p-2" />
							<Input
								label="Production Company"
								placeholder="Hiway"
								maxLength={70}
								value={media.metadata?.productionCompany}
								onChange={(value: any) => {
									setFormData({ ...formData, productionCompany: value });
								}}
								error={getError('productionCompany')}
							/>
							<div className="p-2" />
							<AddCrewItem
								value={media.metadata?.crew}
								onChange={(value: any) => {
									setFormData({ ...formData, crew: value });
								}}
								error={getError('crew')}
							/>
							<div className="p-2" />

							<p className="font-primary font-normal text-[16px] text-white-100 uppercase pt-4">
								Add Thumbnail
							</p>
							<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
							<label className="block text-[8px] font-extralight uppercase text-white-60 dark:text-white overflow-hidden">
								<span style={{ whiteSpace: 'pre-line' }}>
									Select or upload a picture that shows what&apos;s in your video. A good thumbnail
									stands out and draws viewers&apos; attention.{'\n'}Lorem ipsum dolor sit amet
								</span>
							</label>
							<div className="p-2" />
							<AddThumbnail
								media={media}
								title="Thumbnails"
								uploadModalTitle="Upload thumbnail"
								buttonText="Set as default"
								selectedSrc={media.cfThumbnail || ''}
								onChange={(src: string) => (media.cfThumbnail = src)}
								updateDefault={true}
							/>
							<div className="p-2" />
						</div>
					</div>
				</div>
			</>
		</>
	);
}
