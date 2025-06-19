'use client';

import BaseModel from '@/components/base-model.component';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';

interface Props {
	isOpen: boolean;
	handleClose: () => void;
}

export function DeactivateWidget(props: Props) {
	return (
		<BaseModel
			isOpen={props.isOpen}
			handleClose={props.handleClose}
			handleOutsideClick={() => {
				props.handleClose;
			}}
		>
			<div className="relative w-2/6 h-fit max-w-[580px] xl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] p-9">
				<div className="flex flex-row justify-between w-full items-center">
					<div className={`flex flex-row items-center`}>
						<Icon name="delete" className="mr-[8px] fill-red-200 " size="smedium" />
						<label className="block m-2 text-[16px] text-white-100 font-normal uppercase overflow-hidden">
							<span className="line-clamp-2">Deactivate Publishing</span>
						</label>
					</div>
					<Button type="icon" iconColorType="icon-primary" square onClick={props.handleClose}>
						<Icon name="close" size="medium" />
					</Button>
				</div>
				<div className="p-4" />
				<p className="font-primary font-normal text-[22px] text-white-100 uppercase  text-center">
					Are you sure you want to Deactivate the publishing?
				</p>
				<div className="p-1" />
				<p className="font-primary font-normal text-[10px] text-gray-200 uppercase  text-center">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit
				</p>
				<div className="p-1" />
				<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
				<div className="p-1" />
				<Button type="danger" fluid>
					Yes
				</Button>
				<div className="p-2" />
				<Button type="secondary" fluid onClick={props.handleClose}>
					No
				</Button>
			</div>
		</BaseModel>
	);
}
