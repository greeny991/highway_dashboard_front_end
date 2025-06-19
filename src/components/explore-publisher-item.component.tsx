'use client';

import { Icon } from '@/components/icon/icon.component';
import { Button } from '@/components/button/button.component';
import { ICompany } from '@/interfaces/company.interface';

interface Props {
	company: ICompany;
}

export function ExplorePublisherItem(props: Props) {
	return (
		<div className="w-full flex flex-col border border-gray-460 rounded-[10px] overflow-hidden">
			<div
				className={`w-full aspect-[1.68/1] bg-gray-910 rounded-t-[8px] transition-all duration-100 ease-in-out overflow-hidden`}
			>
				<div
					className={`w-full h-full bg-gray-925 overflow-hidden flex items-center justify-center`}
				>
					{props.company.logo && (
						<img src={props.company.logo} className="object-cover w-full h-full" />
					)}
					{!props.company.logo && (
						<img src={'/images/default.png'} className="object-cover w-full h-full" />
					)}
				</div>
			</div>
			<div className="w-full flex flex-col p-4 gap-2">
				<div className="flex justify-between items-center w-full gap-2">
					<span className="truncate text-[16px] font-primary font-bold text-white-100">
						{props.company.name}
					</span>
					<Button type="explore" className="flex-shrink-0">
						Explore catalogue
					</Button>
				</div>
				<div className="flex w-full">
					<span className="truncate text-[10px] font-primary font-normal text-gray-150">
						Some description here.
					</span>
				</div>
				<div className="flex flex-wrap gap-1">
					<Button type="icon" iconColorType="primary-dark">
						<Icon name="in" size="small" className="bg-gray-150 p-1 rounded-full" />
					</Button>
					<Button type="icon" iconColorType="primary-dark">
						<Icon name="instagram" size="small" className="bg-gray-150 p-1 rounded-full" />
					</Button>
					<Button type="icon" iconColorType="primary-dark">
						<Icon name="twitter" size="small" className="bg-gray-150 p-1 rounded-full" />
					</Button>
					<Button type="icon" iconColorType="primary-dark">
						<Icon name="telegram-wo-bg" size="small" className="bg-gray-150 p-1 rounded-full" />
					</Button>
					<Button type="icon" iconColorType="primary-dark">
						<Icon name="bookmark" size="small" className="bg-gray-150 p-1 rounded-full" />
					</Button>
				</div>
			</div>
		</div>
	);
}
