'use client';

import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import { Input } from '@/components/input.component';
import { CopyToClipboard } from '@/utils/copy-to-clipboard.util';
import { useEffect, useRef, useState } from 'react';

interface Props {
	trigger: any;
	publicationId: string;
	changeState: (isOpened: boolean) => void;
}

export function SmartLinkDropdown(props: Props) {
	const element = useRef<any>();
	const [isOpened, setIsOpened] = useState(false);

	useEffect(() => {
		const handler = (event: any) => {
			if (!element.current) {
				return;
			}
			if (
				!element.current.contains(event.target) &&
				!props.trigger.current.contains(event.target)
			) {
				setIsOpened(false);
				props.changeState(false);
			}
		};
		document.addEventListener('click', handler, true);
		return () => {
			document.removeEventListener('click', handler);
		};
	}, []);

	useEffect(() => {
		const handleClick = () => {
			const isOpened = JSON.parse(element.current.getAttribute('data-open'));
			setIsOpened(!isOpened);
			props.changeState(!isOpened);
		};
		props.trigger.current.addEventListener('click', handleClick);
		return () => {
			if (props.trigger.current) {
				props.trigger.current.removeEventListener('click', handleClick);
			}
		};
	}, []);

	return (
		<div
			className={`w-50 my-[2px] z-10 bg-gray-800 rounded-[8px] shadow-lg focus:outline-none ${isOpened ? '' : 'hidden'}`}
			ref={element}
			data-open={isOpened}
		>
			<div className="relative w-[384px] h-fit flex flex-col items-center bg-gray-800 rounded-[8px] p-5">
				<div className="flex flex-row justify-between w-full items-center">
					<div className={`flex flex-row items-center`}>
						<Icon
							name="smart-link"
							className="mr-[8px] p-[8px] bg-green-200 bg-opacity-15 rounded-full fill-green-200 hover:fill-green-200"
							size="small"
						/>
						<label className="block m-2 text-[16px] text-white-100 font-normal uppercase overflow-hidden">
							<span className="line-clamp-2">Copy Link</span>
						</label>
					</div>
				</div>
				<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
				<Input
					label="Share Link"
					placeholder={`${process.env.NEXT_PUBLIC_BASE_APP_URL}/watch/${props.publicationId}`}
					disabled
					onChange={() => {}}
				/>
				<div className="p-2" />
				<Button
					type="primary"
					iconColorType="primary-dark"
					fluid
					onClick={() => {
						CopyToClipboard(`${process.env.NEXT_PUBLIC_BASE_APP_URL}/watch/${props.publicationId}`);
					}}
				>
					Copy Share Link
					<Icon name="smart-link" className="ml-2" size="small" />
				</Button>
			</div>
		</div>
	);
}
