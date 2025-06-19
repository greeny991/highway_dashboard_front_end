'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Icon } from '@/components/icon/icon.component';
import { Button } from './button/button.component';
import { Dropdown } from '@/components/dropdown/dropdown.component';
import { IPublication } from '@/interfaces/publication.interface';
import { FormatDate } from '@/utils/format-date.util';
import { CopyToClipboard } from '@/utils/copy-to-clipboard.util';
import { PublicationType } from '@/config/publication-type.enum';
import { getEmbedCode, getSmartlink } from '@/utils';

interface Props {
	data: IPublication;
	hasBackground?: boolean;
	truncate?: string;
	inProgress?: boolean;
}

export function PublicAssetsItem(props: Props) {
	const router = useRouter();
	const dropdownTrigger = useRef<any>(null);
	const [showDropdownOptions, setShowDropdownOptions] = useState(false);

	return (
		<>
			<tr
				className={`
        ${props.hasBackground && !props.inProgress ? ' bg-white-10 rounded-lg' : ''}
        ${props.inProgress && 'bg-green-800'}
        hover:bg-green-800`}
			>
				<td className={`px-4`}>
					<div className="py-4">
						<div className="relative w-[102px] aspect-[1.68/1] rounded-[8px]">
							<img
								src={props.data.thumbnail ? props.data.thumbnail : '/images/default.png'}
								className="w-full h-full object-cover rounded-[8px]"
							/>
						</div>
					</div>
				</td>
				<td className={`px-4 max-w-[300px] truncate`}>{props.data.displayName}</td>
				{props.inProgress && (
					<>
						<td>
							<div className="animate-pulse h-[10px] mr-8 bg-green-600 rounded" />
						</td>
						<td>
							<div className="animate-pulse h-[10px] mr-8 bg-green-600 rounded" />
						</td>
						<td>
							<div className="animate-pulse h-[10px] mr-8 bg-green-600 rounded" />
						</td>
						<td>
							<div className="animate-pulse h-[10px] mr-8 bg-green-600 rounded" />
						</td>
						<td>
							<div className="animate-pulse h-[10px] mr-8 bg-green-600 rounded" />
						</td>
						<td>
							<div className="animate-pulse h-[10px] mr-8 bg-green-600 rounded" />
						</td>
					</>
				)}

				{!props.inProgress && (
					<>
						<td className={`px-4`}>02:00:00</td>
						<td className={`px-4`}>
							{props.data.type === PublicationType.PAID ? `$${props.data.price}` : 'Free'}
						</td>
						<td className={`text-blue-250 underline px-4`}>
							<span
								className="cursor-pointer"
								onClick={() =>
									router.push(`/studio/media/${props.data.mediaId}`, { scroll: false })
								}
							>
								{props.data.mediaId}
							</span>
						</td>
						<td className={`px-4`}>{FormatDate(new Date(props.data.createdAt))}</td>
						<td className={`px-4`}>{props.data.views}</td>
						<td className={`px-4`}>--</td>
					</>
				)}

				<td className={`px-4`}>
					<div className="flex w-fit">
						<Button
							type="icon"
							iconColorType="icon"
							title="Copy the smartlink to the clipboard"
							className="mr-[4px]"
							onClick={async () => {
								const result = await CopyToClipboard(
									getSmartlink(props.data.mediaId, props.data.id)
								);
								if (result) toast('Copied Smartlink to clipboard');
								else toast.error('Something went wrong');
							}}
							disabled={props.inProgress}
						>
							<Icon name="smart-link" size="small" className="bg-white-15 p-3 rounded-lg" />
						</Button>
						<Button
							type="icon"
							iconColorType="icon"
							title="Copy the embed code to the clipboard"
							className="mr-[4px]"
							onClick={async () => {
								const result = await CopyToClipboard(
									getEmbedCode(props.data.mediaId, props.data.id)
								);
								if (result) toast('Copied Embed Code to clipboard');
								else toast.error('Something went wrong');
							}}
							disabled={props.inProgress}
						>
							<Icon name="multiplayer" size="small" className="bg-white-15  p-3 rounded-lg" />
						</Button>
						<div className="relative" ref={dropdownTrigger}>
							<Button type="icon" iconColorType="icon" disabled={props.inProgress}>
								<Icon name="more" size="small" className="bg-white-15 p-3 rounded-lg" />
							</Button>
							<Dropdown
								trigger={dropdownTrigger}
								position="right-1 top-12"
								changeState={(isOpened) => setShowDropdownOptions(isOpened)}
								items={[
									{
										name: 'View',
										click: () =>
											router.push(`/studio/publication/${props.data.id}`, { scroll: false })
									},
									{
										name: 'Unpublish',
										click: () => {}
									}
								]}
							/>
						</div>
					</div>
				</td>
			</tr>
			<tr style={{ height: '1px' }}></tr>
		</>
	);
}
