'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/button/button.component';
import { Icon } from '@/components/icon/icon.component';
import BaseModel from '@/components/base-model.component';
import { PublishItem } from './publish-item.component';
import { useMedia } from '@/contexts/media.context';
import { useEffect } from 'react';

interface Props {
	isOpen: boolean;
	handleClose: () => void;
}

export function PublishModal(props: Props) {
	const router = useRouter();
	const { media } = useMedia();

	//TODO remove when implementing modal
	useEffect(() => {
		if (props.isOpen) {
			router.push(`/studio/media/${media.id}/publish`, { scroll: false });
		}
	}, [props]);

	return (
		<></>
		// <BaseModel isOpen={props.isOpen} handleClose={props.handleClose}>
		// 	<div className="w-2/5 h-fit xxl:max-h-[768px] flex flex-col items-center bg-gray-800 rounded-[8px] p-9">
		// 		<div className="flex flex-row justify-between w-full items-center">
		// 			<div className={`flex flex-row items-center`}>
		// 				<Icon
		// 					name="add"
		// 					className="mr-[8px] p-[6px] bg-green-200 bg-opacity-15 rounded-full fill-green-200 hover:fill-green-200"
		// 					size="medium"
		// 				/>
		// 				<label className="block m-2 text-[16px] text-white-100 font-normal uppercase overflow-hidden">
		// 					<span className="line-clamp-2">Select Thumbnail</span>
		// 				</label>
		// 			</div>
		// 			<Button type="icon" iconColorType="icon-primary" square onClick={props.handleClose}>
		// 				<Icon name="close" size="large" />
		// 			</Button>
		// 		</div>
		// 		<div className="p-3"></div>
		// 		<div className="w-full flex flex-col gap-2">
		// 			<PublishItem
		// 				title="Embeding"
		// 				subtitle="Get a playable link or embed code to integrate interactive content into your website."
		// 				src="code"
		// 				onClick={() => router.push(`/media/${media.id}/publish`, { scroll: false })}
		// 			/>
		// 			<PublishItem
		// 				title="Social Post"
		// 				subtitle="Create content formatted for social media platforms for easy sharing and engagement."
		// 				src="instagram"
		// 				onClick={() => router.push(`/media/${media.id}/publish`, { scroll: false })}
		// 			/>
		// 			<PublishItem
		// 				title="Page Content"
		// 				subtitle="Publish content directly to your dedicated page, seamlessly integrating with your site."
		// 				src="video-plus"
		// 				onClick={() => router.push(`/media/${media.id}/publish`, { scroll: false })}
		// 			/>
		// 		</div>
		// 		<div className="p-2"></div>
		// 	</div>
		// </BaseModel>
	);
}
