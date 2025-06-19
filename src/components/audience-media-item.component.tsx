'use client';

import { PublicationType } from '@/config/publication-type.enum';
import { IWatchPreview } from '@/interfaces/watch.interface';
import { formatCurrencyAmount } from '@/utils/format-currency-amount.util';
import { useRef, useState } from 'react';
import { AudienceDropdown } from './audience-dropdown/audience-dropdown.component';
import { Icon } from './icon/icon.component';
import { TagItem } from './tag-item.component';

interface IProps {
	data: IWatchPreview;
	previewMode: boolean;
	onClick?: (id: string) => void;
}

export function AudienceMediaItem(props: IProps) {
	const [showDropdownOptions, setShowDropdownOptions] = useState(false);
	const dropdownTrigger = useRef<any>(null);

	return (
		<div className=" w-full flex flex-col border border-gray-460 rounded-[10px]">
			<div
				className="relative group"
				onClick={() => {
					if (!props.previewMode && props.onClick) {
						props.onClick(props.data.id);
					}
				}}
			>
				<div
					className={`${props.previewMode ? '' : 'cursor-pointer'} group w-full aspect-[1.68/1] bg-gray-910 rounded-t-[8px] transition-all duration-100 ease-in-out overflow-hidden`}
				>
					<div
						className={`w-full h-full bg-gray-925 overflow-hidden flex items-center justify-center relative`}
					>
						<img src={props.data.thumbnail} className="object-cover w-full h-full" />
						{props.data.type === PublicationType.PAID && (
							<>
								<div className="w-full h-full flex items-center justify-center absolute">
									<Icon
										name="lock"
										size="medium"
										className="fill-white-100 rounded-full p-4 bg-black xl:bg-gray-466 bg-opacity-50"
									/>
								</div>
								{!isNaN(props.data.price) && (
									<div className="absolute px-4 py-1 border border-yellow-900 bg-yellow-250/75 text-yellow-900 rounded-[10px] xl:text-[21px] text-[16px] top-0 right-0 m-4 font-primary font-medium">
										{formatCurrencyAmount(props.data.price, 'USD')}
									</div>
								)}
							</>
						)}
						<div className="absolute px-3 py-1 bg-gray-468 rounded-[10px] text-[16px] xl:text-[12px] text-white-100 bottom-0 right-0 m-4 font-primary font-medium">
							04:59:01
						</div>
					</div>
				</div>
			</div>
			<div className="relative w-full flex flex-row items-center p-4 justify-between">
				<div className="flex flex-col z-10 mt-3 xl:mt-8 w-full">
					{props.data.companyLogo && (
						<div className="absolute top-0 z-10 -translate-y-1/2 transform w-[52px] h-[52px] xl:w-[90px] xl:h-[90px] border border-white-100 bg-white-100 rounded-full overflow-hidden">
							<img src={props.data.companyLogo} className="w-full h-full object-cover" />
						</div>
					)}
					<div className="flex justify-between items-center">
						<span className="truncate max-w-[300px] text-[18px] xl:text-[28px] font-primary font-medium text-white-100">
							{props.data.displayName}
						</span>
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
					<div className="flex flex-wrap gap-4 items-center">
						<span className="truncate max-w-[300px] text-[12px] xl:text-[18px] font-primary font-medium text-gray-150">
							2h | 40k views | 1 month ago
						</span>
						{props.data.rating && (
							<div className="flex flex-wrap gap-4">
								<TagItem value={props.data.rating} />
							</div>
						)}
					</div>
					<div className="flex flex-wrap gap-4 mt-2">
						<TagItem value="Action" isGenre />
						<TagItem value="Drama" isGenre />
					</div>
				</div>

				{!props.previewMode && (
					<AudienceDropdown
						trigger={dropdownTrigger}
						changeState={(isOpened) => setShowDropdownOptions(isOpened)}
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
				)}
			</div>
		</div>
	);
}
