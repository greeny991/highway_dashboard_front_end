export interface ICompanyAnalytics {
	id?: string;
	companyId: string;
	currentMonthEarnings: number;
	currentMonthUniqueViewers: number;
	currentMonthViews: number;
	currentMonthWatchTime: number;
	earningsChange: number;
	previousMonthEarnings: number;
	previousMonthUniqueViewers: number;
	previousMonthViews: number;
	previousMonthWatchTime: number;
	totalEarnings: number;
	totalViews: number;
	totalWatchTime: number;
	uniqueViewers: number;
	uniqueViewersChange: number;
	viewsChange: number;
	watchTimeChange: number;
	viewsChart?: {
		date: string;
		views: number;
	}[];
	countriesData?: {
		country: string;
		code: string;
		totalViews: number;
		viewDuration: number;
		uniqueViews: number;
	}[];
	devicesData?: {
		name: string;
		value: number;
		fill: string;
		views: number;
	}[];
	sourcesData?: {
		name: string;
		uniqueViews: number;
		viewDuration: number;
		totalViews: number;
	}[];
}

export interface ICompanyAnalyticsFilters {
	startDate?: number;
	endDate?: number;
	contentType?: string;
	source?: string;
	device?: string;
	country?: string;
	mediaId?: string;
}
