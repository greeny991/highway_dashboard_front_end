'use client';

import { useState } from 'react';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import BaseModel from '@/components/base-model.component';

interface Props {
	isOpen: boolean;
	availableFiles: string[];
	handleClose: () => void;
	filesSelected: (files: string[]) => void;
}

export function SelectThumbnailModel(props: Props) {
	const [selectedFile, setSelectedFile] = useState<number | null>(null);

	return (
		<BaseModel isOpen={props.isOpen} handleClose={props.handleClose}>
			<div className="w-2/5 h-fit xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] p-9">
				<div className="flex flex-row justify-between w-full items-center">
					<div className={`flex flex-row items-center`}>
						<Icon
							name="add"
							className="mr-[8px] p-[6px] bg-green-200 bg-opacity-15 rounded-full fill-green-200 hover:fill-green-200"
							size="medium"
						/>
						<label className="block m-2 text-[16px] text-white-100 font-normal uppercase overflow-hidden">
							<span className="line-clamp-2">Select Thumbnail</span>
						</label>
					</div>
					<Button type="icon" iconColorType="icon-primary" square onClick={props.handleClose}>
						<Icon name="close" size="large" />
					</Button>
				</div>
				<div className="p-4"></div>
				<div className="grid grid-cols-2 gap-4 px-4">
					{props.availableFiles.map((file, index) => (
						<div
							key={index}
							onClick={() => setSelectedFile(index)}
							className={`relative cursor-pointer overflow-hidden w-[177px] h-[105px] bg-gray-910 rounded-[8px] border ${selectedFile == index ? 'border-yellow-900' : 'border-gray-910'} hover:border-yellow-900`}
						>
							<img
								src={file}
								alt={`Selected file ${index + 1}`}
								className="w-full h-full object-cover rounded-[8px]"
							/>
						</div>
					))}
				</div>
				<div className="p-4"></div>
				<div className=" w-full">
					<Button
						type="primary"
						fluid
						disabled={selectedFile === null}
						onClick={() => {
							props.filesSelected(['/images/default.jpg']);
							props.handleClose();
						}}
					>
						Select
					</Button>
				</div>
			</div>
		</BaseModel>
	);
}
