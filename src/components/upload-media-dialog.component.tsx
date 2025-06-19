'use client';

import React, { useState, useRef, useEffect } from 'react';

export function UploadMediaDialog({ children, onClose, isOpen }: any) {
	const [showDialog, setShowDialog] = useState(isOpen);
	const dialogRef = useRef(null);

	const handleClose = () => {
		setShowDialog(false);
		if (onClose) {
			onClose();
		}
	};

	const handleClickOutside = (event: any) => {
		if (dialogRef.current && !(dialogRef.current as any).contains(event.target)) {
			handleClose();
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []); // Add event listener on component mount, remove on unmount

	return (
		<div
			ref={dialogRef}
			className={`fixed inset-0 bg-gray-500 bg-opacity-75 overflow-auto px-4 py-8 md:p-8 rounded-md transition duration-300 ease-in-out ${
				showDialog ? 'opacity-100 z-50' : 'opacity-0 z-10'
			}`}
		>
			<div className="bg-white rounded-md shadow-lg max-w-2xl mx-auto">
				{children}
				<button
					type="button"
					className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
					onClick={handleClose}
				>
					Close
				</button>
			</div>
		</div>
	);
}
