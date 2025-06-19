'use client';

import { useState } from 'react';
import styles from './add-thumbnail/style.module.scss';
import { Icon } from './icon/icon.component';
import { Button } from './button/button.component';
import { SelectThumbnailModel } from './select-thumbnail-model.component';

export function SelectThumbnail() {
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
	const [avaliableFiles, setAvaliableFiles] = useState<string[]>([
		'/images/default.png',
		'/images/default.png',
		'/images/default.png',
		'/images/default.png'
	]);

	const [modelOpen, setModelOpen] = useState(false);
	function handleAddThumbnail() {
		setModelOpen(true);
	}
	function handleModelClose() {
		setModelOpen(false);
	}

	const handleRemoveFile = (index: number) => {
		setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	const [isHovered, setIsHovered] = useState(false);
	const handleMouseEnter = () => {
		setIsHovered(true);
	};
	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<div className="w-full flex flex-row gap-4">
			{selectedFiles.length < 1 && (
				<div
					className={`group w-1/2 aspect-[1.68/1]  bg-[url('/images/dragdrop-bg.svg')] bg-cover rounded-[8px] cursor-pointer`}
					onClick={handleAddThumbnail}
				>
					<div
						className={`w-full h-full rounded-[8px] p-2 flex items-center justify-center group-hover:bg-yellow-900 group-hover:bg-opacity-15 transition-all duration-30
          ${isHovered ? styles.linesBorderBoxYellow : styles.linesBorderBox}`}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						<Icon
							name="add"
							size="medium"
							className="fill-gray-910 rounded-full p-2 bg-white-100 group-hover:bg-yellow-900"
						/>
					</div>
				</div>
			)}
			{selectedFiles.map((file, index) => (
				<div
					key={index}
					className={`relative w-1/2 aspect-[1.68/1] bg-gray-910 rounded-[8px] border border-bg-gray-910 hover:border-yellow-900`}
				>
					<img
						src={file}
						alt={`Selected file ${index + 1}`}
						className="w-full h-full object-cover rounded-[8px]"
					/>
					<div className="absolute top-0 right-0 rounded-[8px]">
						<Button type="icon" onClick={() => handleRemoveFile(index)}>
							<Icon
								name="close"
								size="small"
								className="fill-white-100 rounded-full p-1 bg-red-200"
							/>
						</Button>
					</div>
				</div>
			))}
			{modelOpen && (
				<SelectThumbnailModel
					isOpen={modelOpen}
					availableFiles={avaliableFiles}
					handleClose={handleModelClose}
					filesSelected={(files) => {
						handleModelClose();
						setSelectedFiles(files);
					}}
				></SelectThumbnailModel>
			)}
		</div>
	);
}
