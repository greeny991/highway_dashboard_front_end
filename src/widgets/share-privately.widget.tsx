'use client';

import { AddEmailInviteItem } from '@/components/add-email-invite.component';
import BaseModel from '@/components/base-model.component';
import { Button } from '@/components/button/button.component';
import { DatePicker } from '@/components/date-picker/date-picker.component';
import { Icon } from '@/components/icon/icon.component';
import { Input } from '@/components/input.component';
import { SelectOption } from '@/components/select-option.component';
import { ToggleSelectionItem } from '@/components/toggle-selection-item.component';
import { getShareByMediaId, shareMedia } from '@/lib/api';
import { useState, useEffect } from 'react';
import { z, ZodError } from 'zod';
import { AuthUser, SHAREACCESSTYPE, SHAREPERMISSION } from '@/types';

const types = [
	{
		label: 'Only people added can access',
		value: SHAREACCESSTYPE.ONLY_ADDED,
		icon: <Icon name="profile" className="mr-[8px] p-[8px] fill-white-100" size="small" />
	},
	{
		label: 'Anyone with the link can view',
		value: SHAREACCESSTYPE.ANYONE_WITH_LINK,
		icon: <Icon name="link" className="mr-[8px] p-[8px] fill-white-100" size="small" />
	},
	{
		label: 'People in your company can view',
		value: SHAREACCESSTYPE.COMPANY,
		icon: <Icon name="briefcase" className="mr-[8px] p-[8px] fill-white-100" size="small" />
	}
];

const permissionTypes = [
	{
		label: 'View',
		value: SHAREPERMISSION.VIEW,
		icon: <Icon name="eye" className="mr-[8px] p-[8px] fill-white-100" size="small" />
	},
	{
		label: 'View and download',
		value: SHAREPERMISSION.VIEW_AND_DOWNLOAD,
		icon: <Icon name="download" className="mr-[8px] p-[8px] fill-white-100" size="small" />
	}
];

interface Props {
	mediaId: string;
	isOpen: boolean;
	handleClose: () => void;
}

export function SharePrivatelyWidget(props: Props) {
	const [typeOfAccess, setTypeOfAccess] = useState<SHAREACCESSTYPE>(
		SHAREACCESSTYPE.ANYONE_WITH_LINK
	);
	const [permission, setPermission] = useState<SHAREPERMISSION>(SHAREPERMISSION.VIEW);
	const [formErrors, setFormErrors] = useState<any[]>([]);
	const [email, setEmail] = useState<{ name: string; position: string }[]>([]);
	const [expireLink, setExpireLink] = useState(false);
	const [expireDate, setExpireDate] = useState<Date>(new Date());
	const [maxViews, setMaxViews] = useState(false);
	const [maxViewsCount, setMaxViewsCount] = useState(100);

	const formSchema = z.object({
		email: z
			.array(z.object({ name: z.string().email(), position: z.string() }))
			.min(1, { message: 'At least one email is required' })
	});

	const getError = (name: string): string => {
		const error = formErrors.find((err: any) => err.path.includes(name));
		return error ? error.message : '';
	};

	useEffect(() => {
		if (email.length === 0) return;

		const validateEmails = async () => {
			try {
				await formSchema.parseAsync({ email });
				setFormErrors([]);
			} catch (error) {
				if (error instanceof ZodError) {
					setFormErrors(error.errors);
				}
			}
		};

		validateEmails();
	}, [email]);

	const handleSubmit = async () => {
		console.log({
			typeOfAccess,
			email,
			expireDate,
			maxViews,
			permission
		});
		if (typeOfAccess === SHAREACCESSTYPE.ONLY_ADDED && email.length === 0) {
			setFormErrors([{ message: 'At least one email is required', path: ['email'] }]);
			return;
		}

		try {
			const res = await shareMedia({
				...(maxViews && { maxViews: maxViewsCount }),
				accessType: typeOfAccess,
				permission: permission,
				id: props.mediaId,
				...(expireLink && { expiresAt: expireDate.toISOString() }),
				...(typeOfAccess === SHAREACCESSTYPE.ONLY_ADDED &&
					email.length > 0 && { emails: email.map((e) => e.name) })
			});
			// props.handleClose();
		} catch (error) {
			if (error instanceof ZodError) {
				setFormErrors(error.errors);
			} else {
				console.error('Unexpected error:', error);
			}
		}
	};

	useEffect(() => {
		const fetchShare = async () => {
			const res = await getShareByMediaId({ id: props.mediaId });
			console.log(res);
			if (res.data) {
				setTypeOfAccess(res.data.accessType);
				setEmail(res.data.emails.map((email) => ({ name: email, position: 'eye' })));
				if (res.data.expiresAt) {
					setExpireLink(true);
					setExpireDate(new Date(res.data.expiresAt));
				}
			}
		};
		fetchShare();
	}, []);

	return (
		<BaseModel
			isOpen={props.isOpen}
			handleClose={props.handleClose}
			handleOutsideClick={props.handleClose}
		>
			<div className="relative w-3/5 h-fit  max-w-[660px] xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] p-9">
				<div className="flex flex-row justify-between w-full items-center">
					<div className="flex flex-row items-center">
						<Icon
							name="share"
							className="mr-[8px] p-[8px] bg-green-200 bg-opacity-15 rounded-full fill-green-200 hover:fill-green-200"
							size="small"
						/>
						<label className="block m-2 font-primary text-[16px] text-white-100 font-normal uppercase overflow-hidden">
							<span className="line-clamp-2">Share</span>
						</label>
					</div>
					<Icon
						name="close"
						size="medium"
						className="p-[4px] fill-gray-200 hover:fill-green-200 hover:cursor-pointer"
						onClick={props.handleClose}
					/>
				</div>

				<div className="overflow-y-auto scrollbar-custom w-full max-h-[480px] pr-2">
					<div className="p-3" />

					<Input
						label="Share Link"
						placeholder={`${process.env.NEXT_PUBLIC_BASE_APP_URL}/watch/${props.mediaId}`}
						disabled
						onChange={() => {}}
						value={`${process.env.NEXT_PUBLIC_BASE_APP_URL}/watch/${props.mediaId}`}
						showCopyButton
					/>
					<hr className="w-full h-px my-3 bg-white-10 border-0 rounded" />

					<SelectOption
						placeholder="Who can access"
						label="Who can access"
						options={types}
						onChange={(value) => {
							setTypeOfAccess(value[0] as SHAREACCESSTYPE);
						}}
						value={[typeOfAccess]}
					/>
					<hr className="w-full h-px my-3 bg-white-10 border-0 rounded" />

					<SelectOption
						placeholder="Type of access"
						label="Type of access"
						options={permissionTypes}
						onChange={(value) => {
							setPermission(value[0] as SHAREPERMISSION);
						}}
						value={[permission]}
					/>

					{typeOfAccess === SHAREACCESSTYPE.ONLY_ADDED && (
						<>
							<hr className="w-full h-px my-3 bg-white-10 border-0 rounded" />

							<div className="text-left relative w-full">
								<label className="block text-[10px] mb-1 text-white-60 uppercase font-extralight">
									Share with:
								</label>
							</div>

							<AddEmailInviteItem
								value={email}
								onChange={(newEmails: { name: string; position: string }[]) => {
									console.log(newEmails);
									setEmail(newEmails);
								}}
								error={getError('email')}
							/>
						</>
					)}

					<hr className="w-full h-px my-3 bg-white-10 border-0 rounded" />

					{/* Max views */}
					<div className="flex flex-col items-left w-full">
						<ToggleSelectionItem
							title="Max views"
							isOn={maxViews}
							onClick={() => setMaxViews(!maxViews)}
						/>

						{maxViews && (
							<>
								<div className="flex flex-col items-left w-full">
									<Input
										label="Max views"
										value={maxViewsCount}
										onChange={(e) => setMaxViewsCount(e.target.value)}
									/>
								</div>
								<hr className="w-full h-px my-3 bg-white-10 border-0 rounded" />
							</>
						)}
					</div>

					<div className="flex flex-col items-left w-full mt-4">
						<ToggleSelectionItem
							title="Expire link"
							isOn={expireLink}
							onClick={() => setExpireLink(!expireLink)}
						/>
						{expireLink && (
							<div className="pt-[8px]">
								<DatePicker
									label="Release Date"
									value={expireDate}
									onChange={(date: Date) => setExpireDate(date)}
								/>
							</div>
						)}
					</div>
				</div>
				<div className="p-2" />
				<div className="w-full grid grid-cols-2 gap-2">
					<div className="w-full">
						<Button type="default" fluid onClick={props.handleClose}>
							Cancel
						</Button>
					</div>
					<div className="w-full">
						<Button type="primary" fluid onClick={handleSubmit}>
							Save
						</Button>
					</div>
				</div>
			</div>
		</BaseModel>
	);
}
