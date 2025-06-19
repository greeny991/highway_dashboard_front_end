'use client';

import { useState } from 'react';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import BaseModel from '@/components/base-model.component';
import { UploadMediaDropbox } from '@/components/upload-media-dropbox/upload-media-dropbox.component';

interface Props {
	title?: string;
	isOpen: boolean;
	multiple?: boolean;
	accept?: string;
	handleClose: () => void;
	filesSelected: (files: File[]) => void;
}

export function UploadMediaWidget(props: Props) {
	const [isDragging, setIsDragging] = useState(false);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);

		const files = Array.from(e.dataTransfer.files);
		const videoFiles = files.filter((file) => file.type.startsWith('video/'));
		setSelectedFiles(videoFiles);
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		setSelectedFiles(files);
	};

	const handlePaste = (e: any) => {
		if (e) {
			const items = e.clipboardData?.items;
			if (items) {
				const files = Array.from(items).map((item: any) => item.getAsFile());
				const videoFiles = files.filter(
					(file) => file && file.type && file.type.startsWith('video/')
				);
				setSelectedFiles(videoFiles as File[]);
			}
		}
	};

	const handleRemoveFile = (index: number) => {
		setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	return (
		<BaseModel isOpen={props.isOpen} handleClose={props.handleClose}>
			<div
				className="w-[690px] h-[660px] flex flex-col items-center bg-gray-800 rounded-[8px] gap-6 p-8"
				onPaste={handlePaste}
			>
				<div className="flex flex-row justify-between w-full items-center">
					<div className={`flex flex-row items-center`}>
						<Icon
							name="add"
							className="mr-[8px] p-[8px] bg-green-200 bg-opacity-15 rounded-full fill-green-200 hover:fill-green-200"
							size="small"
						/>
						<label className="block m-2 font-primary   text-[16px] text-white-100 font-normal uppercase overflow-hidden">
							<span className="line-clamp-2">{props.title}</span>
						</label>
					</div>
					<Icon
						name="close"
						size="medium"
						className="p-[4px] fill-gray-200 hover:fill-green-200 hover:cursor-pointer"
						onClick={props.handleClose}
					/>
				</div>
				<div className="w-full">
					<label className="block mb-2 font-primary   text-[8px] font-extralight uppercase text-white-60">
						Source
					</label>
					<div className="border border-white-60 rounded-[8px]">
						<select
							id="source"
							className="h-[48px] border-r-8 font-primary   font-extralight border-gray-900 bg-gray-900 text-[14px] text-white-100 placeholder:text-[12px] placeholder:text-white-60 rounded-[8px] block w-full px-2.5"
							defaultValue="computer"
							disabled
						>
							<option value="computer" className="bg-gray-900 text-white-100 p-4">
								Upload from computer
							</option>
							<option value="other" className="bg-gray-900 text-white-100">
								Other options
							</option>
						</select>
					</div>
				</div>
				<UploadMediaDropbox
					selectedFiles={selectedFiles}
					isDragging={isDragging}
					handleDragEnter={handleDragEnter}
					handleDragLeave={handleDragLeave}
					handleDrop={handleDrop}
					handleFileInputChange={handleFileInputChange}
					handlePaste={handlePaste}
					handleRemove={handleRemoveFile}
					multiple={props.multiple}
					accept={props.accept}
				/>
				<div className=" w-full">
					<Button
						type="primary"
						fluid
						disabled={selectedFiles.length == 0}
						onClick={() => {
							props.filesSelected(selectedFiles);
							props.handleClose();
							setSelectedFiles([]);
						}}
					>
						Continue
					</Button>
				</div>
			</div>
		</BaseModel>
	);
}
