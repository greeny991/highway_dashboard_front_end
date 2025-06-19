'use client';

import { Icon } from '@/components/icon/icon.component';
import { SelectedFileItem } from '@/components/selected-file-item.component';
import styles from './style.module.scss';

interface Props {
	selectedFiles: File[];
	isDragging: boolean;
	multiple?: boolean;
	accept?: string;
	handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
	handleDragLeave: () => void;
	handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
	handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handlePaste: (e: any) => any;
	handleRemove: (index: number) => void;
}

export function UploadMediaDropbox(props: Props) {
	return (
		<>
			{props.selectedFiles.length === 0 ? (
				<div
					className="bg-[url('/images/dragdrop-bg.svg')] w-full h-full rounded-[8px]"
					onDragEnter={props.handleDragEnter}
					onDragOver={props.handleDragEnter}
					onDragLeave={props.handleDragLeave}
					onDrop={props.handleDrop}
					onPaste={props.handlePaste}
				>
					<div
						className={`flex flex-col items-center justify-center w-full h-full rounded-[8px] bg-gray-900 ${
							props.isDragging
								? 'border border-green-200 bg-green-200 bg-opacity-5'
								: styles.linesBorderBox
						}`}
					>
						<label
							className="relative w-full h-full flex flex-col font-primary   font-extralight items-center justify-center cursor-pointer p-6"
							htmlFor="dropdown-file-input"
						>
							<input
								type="file"
								id="dropdown-file-input"
								className="absolute w-0 h-0 overflow-hidden"
								onChange={props.handleFileInputChange}
								multiple={props.multiple}
								accept={props.accept || '*'}
							/>
							<Icon
								name="folder-upload"
								className="mr-[8px] p-[16px] bg-white-100 bg-opacity-5 rounded-[8px] fill-white-100"
								size="medium"
							/>
							<div className="p-4" />
							<p className="mb-2 text-[16px] font-normal  text-white-100">
								Press to select files from computer
							</p>
							<p className="text-[12px] font-normal  text-gray-200">
								Drag and Drop, Copy and Paste Files
							</p>
						</label>
					</div>
				</div>
			) : (
				<div className="flex flex-col h-full w-full bg-gray-900 rounded-[8px]">
					{props.selectedFiles.map((file, index) => (
						<SelectedFileItem
							key={index}
							label={file.name}
							remove={() => props.handleRemove(index)}
						/>
					))}
				</div>
			)}
		</>
	);
}
