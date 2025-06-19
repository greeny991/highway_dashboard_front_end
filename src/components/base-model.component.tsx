import React, { ReactNode, useEffect } from 'react';
import ReactPortal from './react-portal';

interface BaseModelProps {
	children: ReactNode;
	isOpen: boolean;
	handleClose: () => void;
	handleOutsideClick?: () => void;
	top?: boolean;
}

const BaseModel = ({ children, isOpen, handleClose, handleOutsideClick }: BaseModelProps) => {
	useEffect(() => {
		const closeOnEscapeKey = (e: KeyboardEvent) => {
			return e.key === 'Escape' ? handleClose() : null;
		};
		document.body.addEventListener('keydown', closeOnEscapeKey);
		return () => {
			document.body.removeEventListener('keydown', closeOnEscapeKey);
		};
	}, [handleClose]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<ReactPortal wrapperId="react-portal-model-container">
			<>
				<div
					className="fixed top-0 left-0 w-screen h-screen bg-gray-950 opacity-70 z-50"
					onClick={handleOutsideClick}
				></div>
				<div
					className={`fixed rounded-[8px] flex flex-col items-center ${top ? 'justify-top' : 'justify-center'} z-[60] overflow-hidden inset-8`}
				>
					{children}
				</div>
			</>
		</ReactPortal>
	);
};

export default BaseModel;
