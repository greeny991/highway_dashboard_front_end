import { MediaStatus } from '@/config/media-status.enum';

export interface IMedia {
	id: string;
	name: string;
	cfMasterHash: string;
	cfMezzanineHash?: string;
	cfWriteToken: string;
	cfObjectId: string;
	cfLibraryId: string;
	cfThumbnail?: string;
	companyId: string;
	userId: string;
	enabled: boolean;
	node: string;
	published: false;
	createdAt: string;
	updatedAt: string;
	mediaMetadataId: null;
	metadata?: IMediaMetadata;
	status: MediaStatus;
	fileUrl: string;
	token: string;
}

export interface IMediaMetadata {
	title: string;
	description: string;
	contentType: string;
	rating: string;
	episodicContent: boolean;
	seasonNumber?: number;
	episodeNumber?: number;
	duration: string;
	releaseDate: string;
	originalLanguage: string;
	genre: string[];
	cast: string[];
	productionCompany: string;
	crew: IMediaMetadataCrew[];
}

export interface IMediaMetadataCrew {
	position: string;
	name: string;
}
