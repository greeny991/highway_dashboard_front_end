/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddLink } from '@/components/add-link.component';
import { Button } from '@/components/button/button.component';
import { GroupBox } from '@/components/group-box.component';
import { InputFile } from '@/components/input-file.component';
import { RadioGroup } from '@/components/radio-group/radio-group.component';
import { SelectOption } from '@/components/select-option.component';
import { StoragePackageInfo } from '@/components/storage-package-info.component';
import { StreamsPackageInfo } from '@/components/streams-package-info.component';
import { AddonCheckoutWidget } from '@/widgets/addon-checkout.widget';
import { UploadMediaWidget } from '@/widgets/upload-media.widget';
import { useUpload } from '@/contexts/upload.context';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { useDla } from '@/contexts/dla.context';
import { Loader } from '@/components/loader/loader.component';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { ICompany } from '@/interfaces/company.interface';
import { StripeConnect } from '@/components/stripe-connect.component';
import { CompanyEditField } from '@/components/company-edit-field.component';
import { CheckPackagePayment } from '@/widgets/check-package-payment.widget';
import { getPresignedUrl } from '@/lib/api';
import { CompanyType } from '@/config/company-type.enum';

export default function CompanyProfilePage() {
	const router = useRouter();
	const { authenticator } = useAuthenticator();
	const upload = useUpload();
	const { CompanyService } = useDla();
	const [companyType, setCompanyType] = useState<CompanyType | ''>('');
	const [selectedPackage, setSelectedPackage] = useState(1);
	const [changeName, setChangeName] = useState(false);
	const [changeWebsite, setChangeWebsite] = useState(false);
	const [addOnModal, setAddonModal] = useState(false);
	const [uploadImageModel, setUploadImageModel] = useState(false);
	const [companyLogoSrc, setCompanyLogoSrc] = useState<any>();
	const [companyLogoName, setCompanyLogoName] = useState<string>();
	const [showError, setShowError] = useState(false);
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [saveInProgress, setSaveInProgress] = useState(false);
	const [company, setCompany] = useState<ICompany>();
	const [showPackagePaymentModal, setShowPackagePaymentModal] = useState(false);

	const [companyName, setCompanyName] = useState('');
	const [website, setWebsite] = useState('');

	// console.error(`DATA: ${JSON.stringify(company, null, 2)}`);

	function handleChangeName() {
		setChangeName(!changeName);
	}

	function handleChangeWebsite() {
		setChangeWebsite(!changeWebsite);
	}

	async function uploadCompanyLogo(file: File) {
		if (file) {
			const res = await getPresignedUrl({
				filename: file.name,
				type: file.type
			});
			console.log(res);
			if (res.data) {
				// upload image to presign url res.data.uploadUrl
				const uploadRes = await fetch(res.data.uploadUrl, {
					method: 'PUT',
					body: file,
					headers: {
						'Content-Type': file.type
					}
				});

				if (uploadRes.ok) {
					await CompanyService.update({
						id: company?.id as string,
						logo: res.data?.fileUrl
					})
						.then((updatedCompany: ICompany) => {
							setCompany(updatedCompany);
							setSaveInProgress(false);
							setCompanyLogoSrc(res.data?.fileUrl);
						})
						.catch(() => {
							setSaveInProgress(false);
							setShowError(true);
						});
				}
			}
		}
	}

	async function changeCompanyVisibility(isPublic: boolean) {
		setSaveInProgress(true);
		await CompanyService.update({
			id: company?.id as string,
			isPublic
		})
			.then(() => {
				setSaveInProgress(false);
			})
			.catch(() => {
				setSaveInProgress(false);
				setShowError(true);
			});
	}

	async function changeCompanyName(name: string) {
		setSaveInProgress(true);
		setCompanyName(name);
		await CompanyService.update({
			id: company?.id as string,
			name
		})
			.then(() => {
				setSaveInProgress(false);
			})
			.catch(() => {
				setSaveInProgress(false);
				setShowError(true);
			});
	}

	async function changeWebsiteName(website: string) {
		setSaveInProgress(true);
		setWebsite(website);
		await CompanyService.update({
			id: company?.id as string,
			website
		})
			.then(() => {
				setSaveInProgress(false);
			})
			.catch(() => {
				setSaveInProgress(false);
				setShowError(true);
			});
	}

	async function changeCompanyType(type: string) {
		setSaveInProgress(true);
		setCompanyType(type as CompanyType);
		await CompanyService.update({
			id: company?.id as string,
			type: type as CompanyType
		})
			.then(() => {
				setSaveInProgress(false);
			})
			.catch(() => {
				setSaveInProgress(false);
				setShowError(true);
			});
	}

	useEffect(() => {
		if (authenticator.user.companyId) {
			CompanyService.getById(authenticator.user.companyId)
				.then((company: ICompany) => {
					setFetchInProgress(false);
					setCompany(company);

					if (company.logo) {
						setCompanyLogoSrc(company.logo);
					}
					if (company.type) {
						setCompanyType(company.type as CompanyType);
					}
				})
				.catch((error) => {
					setFetchInProgress(false);
					setShowError(true);
				});
		}
	}, [CompanyService, authenticator.user.companyId]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const sid = params.get('sid') as string;
		setShowPackagePaymentModal(!!sid);
	}, []);

	return (
		<>
			<ErrorModelWidget
				isOpen={showError}
				handleAction={() => router.push('/studio/media-catalogue', { scroll: false })}
				handleClose={() => router.push('/studio/media-catalogue', { scroll: false })}
				action="Try again later"
				description="Sorry, there was an unexpected error."
			/>

			{saveInProgress && (
				<div className="fixed w-full h-full top-0 left-0 right-0 z-50">
					<Loader backdrop={true} />
				</div>
			)}

			{fetchInProgress && (
				<div className="fixed w-full h-full top-0 left-0 right-0">
					<Loader backdrop={false} />
				</div>
			)}

			{!showError && !fetchInProgress && company && (
				<div className="mt-[75px]">
					<div className="flex flex-col items-center justify-center py-6 gap-4">
						<div
							className={`w-[78px] h-[78px] rounded-[8px] flex justify-center items-center border border-white-100 overflow-hidden`}
						>
							{!company.logo && (
								<div className="w-full h-full flex justify-center items-center text-white-100 text-[30px] uppercase">
									{company.name.slice(0, 2)}
								</div>
							)}
							{company.logo && (
								<img
									src={companyLogoSrc}
									alt="Company image"
									className="relative z-0 object-cover w-full h-full"
								/>
							)}
						</div>
						<div className="text-[24px] font-primary font-normal text-white-100">
							Hello, {company.name}
						</div>
					</div>
					<div className="flex px-16 justify-center gap-6 pb-6">
						<div className="flex flex-col w-full max-w-[625px] gap-6">
							<GroupBox title="Company Info" iconName="profile-round">
								<div className="flex flex-col gap-4">
									<CompanyEditField
										label="Company Name"
										title={company.name}
										scr="briefcase"
										change={handleChangeName}
										handleDataFromChild={(companyName?: string) => {
											if (companyName) {
												setCompany({ ...company, name: companyName });

												changeCompanyName(companyName);
											}
										}}
									/>
									<CompanyEditField
										label="Company Website"
										title={company.website}
										scr="globe"
										change={handleChangeWebsite}
										handleDataFromChild={(web?: string) => {
											if (web) {
												setCompany({ ...company, website: web });
												changeWebsiteName(web);
											}
										}}
									/>
									<InputFile
										id="company-logo"
										label="Company Logo"
										border={false}
										accept="image/*, image/gif, image/jpeg"
										changeButtonText="Change"
										src={companyLogoSrc}
										name={companyLogoName}
										onTrigger={() => setUploadImageModel(true)}
										onChange={() => {}}
										remove={() => {}}
									/>
									<InputFile
										id="company-background"
										label="Company Background"
										border={false}
										accept="image/*, image/gif, image/jpeg"
										changeButtonText="Change"
										onTrigger={() => console.log('')}
										onChange={() => {}}
										remove={() => {}}
									/>
									<SelectOption
										label="Company Type"
										placeholder="Select Company Type"
										options={[
											{
												label: 'Production Company',
												value: CompanyType.PRODUCTION_COMPANY
											},
											{
												label: 'Content Creator',
												value: CompanyType.CONTENT_CREATOR
											},
											{
												label: 'Music Production',
												value: CompanyType.MUSIC_PRODUCTION
											},
											{
												label: 'Distributor',
												value: CompanyType.DISTRIBUTOR
											},
											{
												label: 'Brand',
												value: CompanyType.BRAND
											},
											{
												label: 'Other',
												value: CompanyType.OTHER
											}
										]}
										onChange={(value: any) => {
											setCompanyType(value[0].value);
											changeCompanyType(value[0].value);
										}}
										value={[companyType]}
										error={''}
									/>
								</div>
							</GroupBox>
							<GroupBox title="Socials" iconName="profile-round">
								<div className="flex flex-col gap-4">
									<AddLink
										label="LINKEDIN link"
										placeholder="linkedin.com/hiway"
										iconName="linkedin"
									/>
									<AddLink
										label="INSTAGRAM link"
										placeholder="instagram.com/hiway"
										iconName="instagram"
									/>
									<AddLink
										label="Twitter link"
										value=""
										placeholder="x.com/hiway"
										iconName="twitter"
									/>
									<AddLink
										label="Telegram link"
										placeholder="telegram.com/hiway"
										iconName="telegram"
									/>
								</div>
							</GroupBox>
							<GroupBox title="Ingest Configuration" iconName="cloud">
								<AddLink
									label="AWS S3 bucket"
									placeholder="http://s3-us-east-1.amazonaws.com/bucket/"
									iconName="amazon"
								/>
							</GroupBox>
						</div>
						<div className="flex flex-col w-full max-w-[625px] gap-6">
							<GroupBox title="Company Settings" iconName="profile-round">
								<div className="flex flex-col gap-4">
									<label className="block font-primary text-[15px] text-white-100 font-medium overflow-hidden">
										<span className="line-clamp-2">Set the company visibility:</span>
									</label>
									<RadioGroup
										label="Public"
										description="Available to be followed, appears in the explore page, all videos defined as to be in the Media Catalogue can be seen"
										value={true}
										selected={company.isPublic}
										onChange={(value: boolean) => {
											setCompany({ ...company, isPublic: true });
											changeCompanyVisibility(true);
										}}
									/>
									<RadioGroup
										label="Private"
										description="NOT available to be followed, does NOT appear in the explore page, no videos are available to be seen to any viewer"
										value={false}
										selected={company.isPublic}
										onChange={(value: boolean) => {
											setCompany({ ...company, isPublic: false });
											changeCompanyVisibility(false);
										}}
									/>
								</div>
							</GroupBox>
							<GroupBox title="Company Billing" iconName="billing">
								<div className="flex flex-col gap-4">
									<StripeConnect company={company} />
									<label className="block font-primary text-[12px] text-gray-200 font-normal uppercase overflow-hidden">
										<span className="line-clamp-2">
											A Stripe account is required to receive revenue from HIWAY
										</span>
									</label>
								</div>
							</GroupBox>
							<GroupBox title="Billing Package" iconName="package">
								<StoragePackageInfo />
								<StreamsPackageInfo />
								<div>
									<Button
										type="primary"
										className="bg-green-600 text-white-100"
										onClick={() => {
											setAddonModal(true);
										}}
									>
										Purchase Packages
									</Button>
								</div>
								<div className="flex flex-col gap-4 border border-gray-460 p-4 rounded-md">
									<label className="block font-primary text-[15px] text-white-100 uppercase font-medium overflow-hidden">
										<span className="line-clamp-2">
											What to do when the package exceeds Streaming limit:
										</span>
									</label>
									<div className="w-full flex flex-col">
										<RadioGroup
											label="Automatically buy Streaming add-on"
											name="package"
											value={1}
											selected={selectedPackage}
											onChange={(value: number) => setSelectedPackage(value)}
										/>
										{selectedPackage === 1 && (
											<div className="flex flex-col items-start pb-4 pl-[28px] pt-[3px]">
												<div className="flex flex-col min-w-[260px] w-fit gap-[5px] border border-gray-460 mt-2 px-4 py-2 rounded-md">
													<div className="font-primary text-[13px] leading-[12px] text-white-100 font-medium uppercase">
														additional Stream hours
													</div>
													<div className="font-primary text-[13px] leading-[12px] text-gray-462 font-medium uppercase">
														+150 hours
													</div>
													<div className="font-primary text-[13px] leading-[12px] text-green-200 font-medium uppercase">
														$60.00 / month
													</div>
												</div>
											</div>
										)}
									</div>
									<RadioGroup
										label="Block Streams"
										name="package"
										value={2}
										selected={selectedPackage}
										onChange={(value: number) => setSelectedPackage(value)}
									/>
								</div>
							</GroupBox>
						</div>
					</div>

					<AddonCheckoutWidget
						isOpen={addOnModal}
						handleClose={() => setAddonModal(false)}
						successUrl={`${process.env.NEXT_PUBLIC_BASE_APP_URL}/studio/company/profile?sid={CHECKOUT_SESSION_ID}`}
						cancelUrl={`${process.env.NEXT_PUBLIC_BASE_APP_URL}/studio/company/profile`}
					/>

					<CheckPackagePayment
						isOpen={showPackagePaymentModal}
						handleClose={() => setShowPackagePaymentModal(false)}
					/>

					<UploadMediaWidget
						title="Company Logo"
						isOpen={uploadImageModel}
						handleClose={() => setUploadImageModel(false)}
						multiple={false}
						accept="image/*, image/gif, image/jpeg"
						filesSelected={(files: File[]) => {
							setUploadImageModel(false);
							setCompanyLogoSrc(URL.createObjectURL(files[0]));
							setCompanyLogoName(files[0].name);
							uploadCompanyLogo(files[0]);
						}}
					></UploadMediaWidget>
				</div>
			)}
		</>
	);
}
