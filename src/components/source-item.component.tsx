'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { IPublication } from '@/interfaces/publication.interface';
import { Icon } from './icon/icon.component';
import { CopyToClipboard } from '@/utils/copy-to-clipboard.util';

interface Props {
	publication: IPublication;
}

export function SourceItem(props: Props) {
	const router = useRouter();

	return (
		<div className="group w-full">
			<div className="flex flex-row bg-gray-910 p-3 rounded-[8px] gap-2">
				<div className="w-[217px] min-w-[217px] h-[132px] rounded-[8px] flex-1 pointer-events-none">
					<img
						src={props.publication.thumbnail}
						className="w-full h-full object-cover rounded-[8px]"
					/>
				</div>
				<div className="flex flex-col justify-center space-y-4">
					<div>
						<label className="block mx-2 text-[10px] pb-1 font-normal uppercase opacity-60 text-white-100 overflow-hidden pointer-events-none">
							Media Name:
						</label>
						<div
							className="flex gap-[2px] max-w-[250px] items-center"
							onClick={() =>
								router.push(`/studio/media/${props.publication.mediaId}`, { scroll: false })
							}
						>
							<label className="truncate block mx-2 text-[14px] font-normal uppercase text-white-100 overflow-hidden cursor-pointer">
								{props.publication.mediaName}
							</label>
							<Icon name="redirect" size="small" className="fill-white-100 cursor-pointer"></Icon>
						</div>
					</div>
					<div>
						<label className="block mx-2 text-[10px] pb-1 font-normal uppercase opacity-60 text-white-100 overflow-hidden pointer-events-none">
							Source ID:
						</label>
						<div
							className="flex gap-[2px] max-w-[250px] items-center"
							onClick={async () => {
								const result = await CopyToClipboard(props.publication.mediaId);
								if (result) toast('Copied media ID to clipboard');
								else toast.error('Something went wrong');
							}}
						>
							<label className="truncate block mx-2 text-[14px] font-normal uppercase underline text-green-200 overflow-hidden cursor-pointer">
								{props.publication.mediaId}
							</label>
							<Icon name="copy" size="smedium" className="fill-white-100 cursor-pointer"></Icon>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
