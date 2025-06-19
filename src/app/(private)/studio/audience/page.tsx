'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/loader/loader.component';
import { SearchBar } from '@/components/search-bar.component';
import { SelectOption } from '@/components/select-option.component';
import { TableControls } from '@/components/table-controls';
import { Genre } from '@/config/genre.config';
import { ContentType } from '@/config/content-type.config';
import { IAudience } from '@/interfaces/audience.interface';
import { useDla } from '@/contexts/dla.context';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { IPaginationResult } from '@/interfaces/pagination.interface';
import { AudienceListItem } from '@/components/audience-list-item.component';
import { TableLoadMore } from '@/components/table-load-more.component';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { PublicationType } from '@/config/publication-type.enum';
import { PublicationStatus } from '@/config/publication-status.enum';
import { PublicationRating } from '@/interfaces/publication.interface';
import { MediaStatus } from '@/config/media-status.enum';

export default function AudiencePage() {
	const router = useRouter();
	const { AudienceService } = useDla();
	const { authenticator } = useAuthenticator();
	const [items, setItems] = useState<IAudience[]>([]);
	const [fetchInProgress, setFetchInProgress] = useState(false);
	const [paginationInProgress, setPaginationInProgress] = useState(false);
	const [contentTypeFilter, setContentTypeFilter] = useState<string | undefined>(undefined);
	const [genreFilter, setGenreFilter] = useState<string | undefined>(undefined);
	const [sortBy, setSortBy] = useState<string>('Recently joined');
	const [continuationToken, setContinuationToken] = useState<string>();
	const [showError, setShowError] = useState(false);
	const [hasFilters, setHasFilters] = useState(false);

	function getData(reset: boolean): void {
		const hasFilters = genreFilter || contentTypeFilter ? true : false;
		const params = {
			companyId: authenticator.user.companyId!,
			perPage: 1,
			continuationToken: reset ? undefined : continuationToken,
			...(genreFilter !== undefined && { genreFilter }),
			...(contentTypeFilter !== undefined && { contentTypeFilter }),
			...(sortBy !== undefined && { sortBy })
		};

		setFetchInProgress(true);
		setHasFilters(hasFilters);
		setPaginationInProgress(!reset);

		AudienceService.findByCompanyId(params)
			.then((data: IPaginationResult<IAudience>) => {
				setItems(reset ? data.items : [...items, ...data.items]);
				setContinuationToken(data.continuationToken);
				setFetchInProgress(false);
				setPaginationInProgress(false);
			})
			.catch(() => {
				setFetchInProgress(false);
				setPaginationInProgress(false);
				setShowError(true);
			});
	}

	useEffect(() => {
		getData(true);
	}, [genreFilter, contentTypeFilter, sortBy]);

	return (
		<>
			<ErrorModelWidget
				isOpen={showError}
				handleAction={() => router.push('/studio/media-catalogue', { scroll: false })}
				handleClose={() => router.push('/studio/media-catalogue', { scroll: false })}
				action="Try again later"
				description="Sorry, there was an unexpected error."
			/>

			{fetchInProgress && !paginationInProgress && (
				<div className="w-full h-full">
					<Loader backdrop={false} />
				</div>
			)}

			{!fetchInProgress && items.length === 0 && !hasFilters && (
				<div className="w-full h-full text-white-100 uppercase flex justify-center items-center px-[40px]">
					There is no data yet
				</div>
			)}

			{(items.length > 0 || hasFilters) && (
				<div className="w-full flex flex-col p-4 pt-[84px]">
					<SearchBar showFilterButton={false} />
					<div className="w-full flex gap-4 pt-[12px]">
						<SelectOption
							value={contentTypeFilter ? [contentTypeFilter] : undefined}
							options={[{ label: '', value: undefined }, ...ContentType]}
							placeholder="FILTER BY CONTENT TYPE"
							onChange={(option) => {
								option[0] === undefined
									? setContentTypeFilter(undefined)
									: setContentTypeFilter(option[0]);
							}}
						/>
						<SelectOption
							value={genreFilter ? [genreFilter] : undefined}
							options={[{ label: '', value: undefined }, ...Genre]}
							placeholder="FILTER BY GENRE"
							onChange={(option) => {
								option[0] === undefined ? setGenreFilter(undefined) : setGenreFilter(option[0]);
							}}
						/>
					</div>
					<TableControls
						sortOptions={[
							'Recently joined',
							// 'Recently followed',
							'Total spent (ascending)',
							'Total spent (descending)'
						]}
						onSortChange={(option) => {
							setSortBy(option);
						}}
					/>
					<div className="w-full flex flex-col pb-4 pt-0">
						<div className="pb-10 bg-gray-900 rounded-lg overflow-hidden">
							{items.length > 0 && (
								<>
									<table className="w-full">
										<thead className="font-primary font-normal text-[10px] uppercase text-white-100 opacity-60 whitespace-nowrap overflow-hidden text-ellipsis">
											<tr>
												<th className="text-start py-4 px-6">User</th>
												<th className="text-start py-4 px-6">Joined</th>
												{/* <th className="text-start py-4 px-6">Followed</th> */}
												<th className="text-start py-4 px-6">Spent</th>
												<th className="text-start py-4 px-6">Genres</th>
												<th className="text-start py-4 px-6">Purchased Media</th>
											</tr>
										</thead>
										<tbody className="font-primary font-normal text-[14px] text-white-100">
											<tr>
												<td colSpan={6} className="pt-4 px-6"></td>
											</tr>
											{items.map((item, index) => (
												<AudienceListItem data={item} key={index} />
											))}
										</tbody>
									</table>
									<TableLoadMore
										fetchInProgress={paginationInProgress}
										continuationToken={continuationToken}
										onEnterView={() => getData(false)}
									/>
								</>
							)}
							{items.length === 0 && (
								<div className="w-full h-full text-white-100 uppercase flex justify-center items-center pt-10">
									No data found for the selected filters
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
