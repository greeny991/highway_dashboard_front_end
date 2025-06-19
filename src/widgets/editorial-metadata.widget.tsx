'use client';

import { MetadetaInfoItem } from '@/components/metadata-info-item.component';
import { ThumbnailItem } from '@/components/thumbnail-item.component';
import { IMedia } from '@/interfaces/media.interface';
import { FormatDate } from '@/utils/format-date.util';
import { useEffect, useState } from 'react';

type Props = {
	media: IMedia;
};
export function EditorialMetadataWidget({ media }: Props) {
	return (
		<div className="">
			<p className="font-primary font-normal text-[16px] lg:text-[18px] text-white-100 uppercase  pt-4">
				{media.metadata?.title}
			</p>
			<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
			<p className="block py-2 text-[10px] font-extralight uppercase text-white-100 dark:text-white overflow-hidden">
				Description
			</p>
			<label className="block text-[12px] font-extralight uppercase text-white-100 dark:text-white overflow-hidden">
				<span style={{ whiteSpace: 'pre-line' }}>{media.metadata?.description}</span>
			</label>
			<hr className="w-full h-px my-4 bg-white-10 border-0 rounded" />
			<MetadetaInfoItem title="Content Type" value={media.metadata?.contentType} />
			{media.metadata?.episodicContent && (
				<MetadetaInfoItem
					title="Episode Number"
					value={media.metadata?.episodeNumber?.toString()}
				/>
			)}
			<MetadetaInfoItem title="Duration" value={media.metadata?.duration} />
			<MetadetaInfoItem title="Original language" value={media.metadata?.originalLanguage} />
			<MetadetaInfoItem
				title="Genre"
				value={media.metadata?.genre ? media.metadata?.genre.join(', ') : ''}
			/>
			<MetadetaInfoItem title="Rating" value={media.metadata?.rating} />
			<MetadetaInfoItem
				title="Release Date"
				value={
					media.metadata?.releaseDate
						? FormatDate(new Date(Number(media.metadata?.releaseDate)))
						: ''
				}
			/>
			<MetadetaInfoItem title="Crew" multipleValues={media.metadata?.crew} />
			<MetadetaInfoItem
				title="Cast"
				value={media.metadata?.cast ? media.metadata?.cast.join(', ') : ''}
			/>
			<MetadetaInfoItem title="Production Company" value={media.metadata?.productionCompany} />
			{media.cfThumbnail && (
				<>
					<p className="block py-2 text-[10px] font-extralight uppercase text-white-100 dark:text-white overflow-hidden">
						Thumbnail
					</p>
					<div className="flex gap-3">
						<ThumbnailItem src={media.cfThumbnail} />
					</div>
				</>
			)}
		</div>
	);
}
