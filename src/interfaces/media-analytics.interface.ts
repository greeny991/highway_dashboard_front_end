export interface IMediaAnalytics {
	id?: string;
	mediaId: string;
	companyId: string;
	totalViews: number;
	averageViewDuration: number;
	totalWatchTime: number;
	uniqueViewers: number;
	uniqueViewersChange: number;
	watchTimeChange: number;
	viewDurationChange: number;
	viewsChange: number;
}
