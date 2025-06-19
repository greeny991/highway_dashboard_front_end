'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/loader/loader.component';
import { PublicAssetsItem } from '@/components/public-assets-item.component';
import { SearchBar } from '@/components/search-bar.component';
import { useDla } from '@/contexts/dla.context';
import { useMediaManager, ProcessingItem } from '@/contexts/media-manager.context';
import { MediaStatus } from '@/config/media-status.enum';
import { IPaginationResult } from '@/interfaces/pagination.interface';
import { IPublication } from '@/interfaces/publication.interface';
import { PublicationStatus } from '@/config/publication-status.enum';

export default function PublicationCataloguePage() {
	const router = useRouter();
	const { processingList } = useMediaManager();
	const { PublicationService } = useDla();
	const [publicationsItems, setPublicationsItems] = useState<IPublication[]>([]);
	const [fetchInProgress, setFetchInProgress] = useState(true);

	function fetchPublications(): void {
		setFetchInProgress(true);
		PublicationService.getAll({
			perPage: 100
		})
			.then((data: IPaginationResult<IPublication>) => {
				setPublicationsItems(data.items);
				setFetchInProgress(false);
			})
			.catch(() => setFetchInProgress(false));
	}

	useEffect(() => {
		fetchPublications();
	}, []);

	useEffect(() => {
		const inProgress = processingList.filter(
			(item: ProcessingItem) =>
				item.status !== MediaStatus.READY && item.status !== MediaStatus.ERROR
		);

		if (processingList.length > 0 && inProgress.length === 0) {
			fetchPublications();
		}
	}, [processingList]);

	return (
		<>
			{fetchInProgress && (
				<div className="w-full h-full">
					<Loader backdrop={false} />
				</div>
			)}

			{!fetchInProgress && publicationsItems.length === 0 && (
				<div className="w-full h-full text-white-100 uppercase flex justify-center items-center px-[40px]">
					You have not published any media yet. Begin by selecting media from the
					<a
						className="cursor-pointer text-blue-250 underline pl-[8px]"
						onClick={() => router.push('/studio/media-catalogue', { scroll: false })}
					>
						media catalogue.
					</a>
				</div>
			)}

			{publicationsItems.length > 0 && (
				<div className="w-full flex flex-col p-4 pt-[75px]">
					<p className="font-primary font-normal text-[16px] text-white-100 uppercase pt-4">
						Public Assets
					</p>
					<SearchBar showFilterButton={true} />
					<div className="p-2" />
					<table className="table-auto">
						<thead className="font-primary font-normal text-[10px] uppercase text-white-100 opacity-60 whitespace-nowrap overflow-hidden text-ellipsis">
							<tr>
								<th className="text-start py-3 px-4">Background</th>
								<th className="text-start py-3 px-4">Display Name</th>
								<th className="text-start py-3 px-4">Duration</th>
								<th className="text-start py-3 px-4">Price</th>
								<th className="text-start py-3 px-4">Media ID</th>
								<th className="text-start py-3 px-4">Published Date</th>
								<th className="text-start py-3 px-4">Views</th>
								<th className="text-start py-3 px-4">Reports</th>
								<th className="text-start py-3 px-4">Actions</th>
							</tr>
						</thead>
						<tbody className="font-primary font-normal text-[14px] text-white-100">
							{publicationsItems.map((item, index) => (
								<PublicAssetsItem
									key={index}
									data={item}
									hasBackground={index % 2 === 0}
									inProgress={item.status === PublicationStatus.IN_PROGRESS}
								/>
							))}
						</tbody>
					</table>
				</div>
			)}
		</>
	);
}
