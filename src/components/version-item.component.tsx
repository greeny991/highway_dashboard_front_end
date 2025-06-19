'use client';

import { Icon } from '@/components/icon/icon.component';
import { TitleValueItem } from './title-value-item.component';
import { Avatar } from './avatar.component';

interface Props {
	title: string;
	subtitle: string;
	current?: boolean;
}

export function VersionItem(props: Props) {
	return (
		<div className="w-full h-fit">
			<div className="flex flex-row h-full justify-between  rounded-[8px] gap-4">
				<div className="relative flex items-center justify-center w-[203px] min-w-[203px] h-[127px] my-2 cursor-pointer">
					<img src="/images/default.png" className="w-full h-full object-cover rounded-[8px]" />
					<Icon
						name="play"
						size="medium"
						className="absolute items-center  fill-white-100 rounded-full p-2 bg-white-15 hover:bg-yellow-900 hover:bg-opacity-20"
					/>
				</div>
				<div className="flex flex-col items-center">
					<Icon
						name={props.current ? 'file-up' : 'check-circle'}
						className={`${props.current ? 'bg-yellow-250 fill-yellow-900' : 'bg-gray-650 fill-white-100'}
            p-[10px] rounded-full`}
						size="smedium"
					/>
					<hr className="w-px h-full mt-1 bg-white-10 border-0 rounded" />
				</div>
				<div className="flex flex-col w-full gap-2 mt-[6px]">
					<div className="flex flex-row justify-between">
						<label className="flex flex-row items-center text-[12px] gap-2 text-white-100 font-normal overflow-hidden">
							{props.current ? 'Replaced by:' : 'Replaced out by:'}
							<div
								className={`${props.current ? 'border-yellow-900' : 'border-white-100'}
                  border border-[2px] bg-gray-950 rounded-full flex justify-center items-center`}
							>
								<img
									src="/images/thumbnail.jpg"
									alt="User avatar"
									className="w-[24px] h-[24px] object-cover rounded-full"
								/>
							</div>
							Taimoor Hasan <label className="text-white-100 text-opacity-60">2 days ago</label>
						</label>
						<label className="flex flex-row text-[12px] gap-2 text-white-100 text-opacity-60 font-normal overflow-hidden">
							{props.current ? 'Current Version' : 'Make Current Version'}
							<Icon name="file-down" className=" fill-white-100" />
						</label>
					</div>
					<div className="flex flex-row items-center">
						<label className="text-[12px] text-white-100 text-opacity-60 font-normal overflow-hidden">
							<span style={{ whiteSpace: 'pre-line' }}>
								Some random details here | Hash:vsjkefbgkyasgfjgsefjgekyfgksehjfg {'\n'}
								File name.mov | Datetime | Some other details | 512 MB
							</span>
						</label>
					</div>
				</div>
			</div>
		</div>
	);
}
