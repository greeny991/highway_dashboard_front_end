'use client';

import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import BaseModel from '@/components/base-model.component';
import { ChangeField } from '@/components/change-field.component';
import { useEffect, useState } from 'react';
import { ChangeEmail } from '@/components/change-email.component';
import { ChangeUsername } from '@/components/change-username.component';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { IUser } from '@/interfaces/user.interface';
import { ICompany } from '@/interfaces/company.interface';
import { useDla } from '@/contexts/dla.context';
import { InputFile } from '@/components/input-file.component';
import { getPresignedUrl } from '@/lib/api';
import { Loader } from '@/components/loader/loader.component';

interface Props {
	isOpen: boolean;
	handleClose: () => void;
	handleDataFromChild?: (arg?: string) => void;
	//emit: any;
}

export function ProfileSettingsWidget(props: Props) {
	//const [username, setUsername] = useState('');
	//const [user, setUser] = useState<IUser>();
	const [saveInProgress, setSaveInProgress] = useState(false);
	const [showError, setShowError] = useState(false);
	const [company, setCompany] = useState<ICompany>();

	const [companyName, setCompanyName] = useState('');

	const [fetchInProgress, setFetchInProgress] = useState(true);
	const { authenticator } = useAuthenticator();
	const [walletConnected, setWalletConnected] = useState(false);
	const [changeUsername, setChangeUsername] = useState(false);
	const [changeEmail, setChangeEmail] = useState(false);
	const [verifyEmail, setVerifyEmail] = useState(false);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState<string>('');
	const [submitError, setSubmitError] = useState('');
	const [image, setImage] = useState<File | undefined>();
	const [imageUrl, setImageUrl] = useState<string | undefined>(authenticator.user.image);
	const [imageUploading, setImageUploading] = useState(false);

	//const { UserService } = useDla();
	const { CompanyService } = useDla();

	useEffect(() => {
		if (authenticator.user.companyId) {
			CompanyService.getById(authenticator.user.companyId)
				.then((company: ICompany) => {
					setFetchInProgress(false);
					setCompany(company);
				})
				.catch((error) => {
					setFetchInProgress(false);
					setShowError(true);
				});
		}
	}, [CompanyService, authenticator.user.companyId]);

	async function changeCompanyName(name: string) {
		setSaveInProgress(true);
		setCompanyName(name);
		setCompany({ ...company, name: companyName } as ICompany);
		await CompanyService.update({
			...(company as ICompany),
			name
		})
			.then(() => {
				setSaveInProgress(false);

				const router = window.location.pathname;
				if (router.includes('/studio/company/profile')) {
					//window.location.reload();
				}
			})
			.catch(() => {
				setSaveInProgress(false);
				setShowError(true);
			});
	}

	async function updateUsername(username: string) {
		console.log('Updating username to:', username);
		setLoading(true);
		setSubmitError('');
		try {
			const success = await authenticator.updateUser({ username });
			console.log('Update result:', success);
			if (success) {
				handleChangeUsername();
				if (props.handleClose) {
					props.handleClose();
				}
			} else {
				setSubmitError('Failed to update username. Please try again.');
			}
		} catch (error) {
			console.error('Error updating username:', error);
			setSubmitError('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	}

	const handleDataFromChild = (username?: string) => {
		console.log('Received username from child:', username);
		if (username) {
			updateUsername(username);
		}
	};

	function handleWalletConnected() {
		setWalletConnected(!walletConnected);
	}

	function handleChangeUsername() {
		console.log('Toggling username change view');
		setChangeUsername(!changeUsername);
	}

	async function handleImageChange(file: File) {
		setImage(file);
		setImageUploading(true);
		try {
			const res = await getPresignedUrl({ filename: file.name, type: file.type });
			if (res.data) {
				const uploadRes = await fetch(res.data.uploadUrl, {
					method: 'PUT',
					body: file,
					headers: { 'Content-Type': file.type }
				});
				if (uploadRes.ok) {
					const fileUrl = res.data.fileUrl;
					const success = await authenticator.updateUser({ image: fileUrl });
					if (success) {
						setImageUrl(fileUrl);
					}
				}
			}
		} catch (err) {
			console.error('Error uploading image:', err);
		} finally {
			setImageUploading(false);
		}
	}

	return (
		<BaseModel isOpen={props.isOpen} handleClose={props.handleClose}>
			{changeUsername ? (
				<ChangeUsername
					loading={loading}
					cancelChange={handleChangeUsername}
					closeModel={props.handleClose}
					sendDataToParent={handleDataFromChild}
					username={authenticator.user.username || ''}
				/>
			) : (
				<div className="w-[520px] h-fit max-w-[660px] xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] gap-6 p-12">
					<div className="flex flex-row justify-between w-full items-center">
						<div className={`flex flex-row items-center`}>
							<Icon
								name="profile-round"
								className="mr-[8px] p-[8px] bg-green-200 bg-opacity-15 rounded-full fill-green-200 hover:fill-green-200"
								size="small"
							/>
							<label className="block m-2 font-primary   text-[16px] text-white-100 font-normal uppercase overflow-hidden">
								<span className="line-clamp-2">Profile Settings</span>
							</label>
						</div>
						<Icon
							name="close"
							size="medium"
							className="p-[4px] fill-gray-200 hover:fill-green-200 hover:cursor-pointer"
							onClick={props.handleClose}
						/>
					</div>
					<ChangeField
						label="Username"
						title={authenticator.user.username || ''}
						scr="profile"
						click={handleChangeUsername}
					/>
					<ChangeField
						label="Email"
						title={authenticator.user.email!}
						scr="message"
						// click={handleChangeEmail}
					/>
					{/*walletConnected ? (
						<ChangeField
							label="wallet"
							title="Metamask"
							subtitle="********2345"
							scr="metamask"
							buttonTitle="Disconnect"
							click={handleWalletConnected}
						/>
					) : (
						<div className="w-full">
							<label className="block mb-2  font-primary   text-[8px] font-extralight uppercase text-white-100">
								Wallet
							</label>
							<Button type="secondary" fluid onClick={handleWalletConnected}>
								Connect Blockchain Wallet <Icon name="wallet" className="pl-[8px]" />
							</Button>
						</div>
					)*/}
					{/* Profile Image Upload */}
					<InputFile
						id="profile-image-input"
						label="Profile Image"
						border={false}
						accept="image/*, image/gif, image/jpeg"
						src={imageUrl}
						name={image?.name}
						onChange={handleImageChange}
						remove={() => {
							setImage(undefined);
							setImageUrl(undefined);
						}}
					/>
					{imageUploading && <Loader backdrop={false} />}
				</div>
			)}
		</BaseModel>
	);
}
