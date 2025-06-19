'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/button.component';
import { Input } from '@/components/input.component';
import { InputFile } from '@/components/input-file.component';
import { BoxWidget } from '@/widgets/box.widget';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { useDla } from '@/contexts/dla.context';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { Loader } from '@/components/loader/loader.component';
import { ICompany } from '@/interfaces/company.interface';
import { useUpload } from '@/contexts/upload.context';
import { getPresignedUrl } from '@/lib/api';

export function CreateCompanyWidget() {
	const { authenticator } = useAuthenticator();
	const { CompanyService } = useDla();
	const [showError, setShowError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [name, setName] = useState('');
	const [website, setWebsite] = useState('');
	const [logo, setLogo] = useState<File>();
	const [error, setError] = useState('');
	const router = useRouter();
	const upload = useUpload();

	function submit() {
		if (name.length < 3 || website.length < 3 || !logo) {
			setError('Please fill in all fields');
			setShowError(true);
			return;
		}

		setLoading(true);

		console.log({
			name,
			website,
			logo
		});

		CompanyService.create({ name, website })
			.then(async (data: ICompany) => {
				const user = authenticator.user;
				authenticator.setUser({
					...user,
					companyId: data.id
				});

				await uploadCompanyLogo(data);
				router.push('/studio', { scroll: false });
			})
			.catch((error) => {
				setLoading(false);
				setShowError(true);
			});
	}

	async function uploadCompanyLogo(data: ICompany) {
		if (logo) {
			const res = await getPresignedUrl({
				filename: logo.name,
				type: logo.type
			});
			console.log(res);
			if (res.data) {
				// upload image to presign url res.data.uploadUrl
				const uploadRes = await fetch(res.data.uploadUrl, {
					method: 'PUT',
					body: logo,
					headers: {
						'Content-Type': logo.type
					}
				});

				if (uploadRes.ok) {
					await CompanyService.update({
						...data,
						logo: res.data.fileUrl
					});
				}
			}
		}
	}

	useEffect(() => {
		if (name.length > 3 && website.length > 3) {
			setDisabled(false);
		}
	}, [name, website]);

	return (
		<>
			{showError && (
				<ErrorModelWidget
					isOpen={showError}
					handleAction={() => setShowError(false)}
					handleClose={() => setShowError(false)}
					action="Try again later"
					description={error || 'Sorry, there was an error creating your account.'}
				/>
			)}
			<BoxWidget title="Create your Company">
				{loading && <Loader />}
				<InputFile
					id="company-img"
					border={false}
					accept="image/*, image/gif, image/jpeg"
					onChange={(file: File) => {
						console.log('file', file);
						setLogo(file);
					}}
					remove={() => setLogo(undefined)}
				/>
				<div className="p-2" />
				<Input
					name="company"
					border={false}
					label="Company Name *"
					placeholder="Your company name"
					onChange={(value) => setName(value)}
				/>
				<div className="p-2" />
				<Input
					name="website"
					border={false}
					label="Company Website *"
					placeholder="yourcompanydomain.com"
					onChange={(value) => setWebsite(value)}
				/>
				<div className="p-2" />
				<Button type="primary" fluid disabled={disabled} onClick={submit}>
					Continue
				</Button>
			</BoxWidget>
		</>
	);
}
