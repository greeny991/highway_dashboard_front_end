export interface IPublicationAnalytics {
	id?: string;
	publicationId: string;
	companyId: string;
	totalEarnings: number;
	totalViews: number;
	totalWatchTime: number;
	currentMonthViews: number;
	previousMonthViews: number;
	currentMonthWatchTime: number;
	previousMonthWatchTime: number;
	viewsChange: number;
	watchTimeChange: number;
	earningsChange: number;
	currentMonthEarnings: number;
	previousMonthEarnings: number;
}
