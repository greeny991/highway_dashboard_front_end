'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DateRangePicker } from '@/components/date-range-picker/date-range-picker.component';
import { Icon } from '@/components/icon/icon.component';
import { formatCurrencyAmount } from '@/utils/format-currency-amount.util';
import {
	ICompanyAnalytics,
	ICompanyAnalyticsFilters
} from '@/interfaces/company-analytics.interface';
import { useDla } from '@/contexts/dla.context';
import { useAuthenticator } from '@/contexts/authenticator/authenticator.context';
import { secondsToHHMMSS } from '@/utils/seconds-handler.util';
import { formatNumberUnitsWithSuffix } from '@/utils/format-number-units-with-suffix.util';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { ContentType } from '@/config/content-type.config';
import {
	Line,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ComposedChart,
	ResponsiveContainer,
	Cell,
	RadialBarChart,
	RadialBar
} from 'recharts';
import { SelectOption } from '@/components/select-option.component';
import Image from 'next/image';
import { Button } from '@/components/button/button.component';
import { FaTwitter, FaLinkedin, FaVimeo, FaEllipsisH } from 'react-icons/fa';
import { numberToPercentage } from '@/utils';
import { countryOptions } from '@/utils/country-options';
import { AnalyticsSkeleton } from '@/components/analytics-skeleton/analytics-skeleton.component';

const viewDurationOptions = [
	{ label: 'Short (< 10 min)', value: 'short' },
	{ label: 'Medium (10-30 min)', value: 'medium' },
	{ label: 'Long (> 30 min)', value: 'long' }
];

const timeOptions = [
	{ label: '1h', value: 'short' },
	{ label: '2h', value: 'medium' },
	{ label: '3h', value: 'long' }
];
const deviceOptions = [
	{ label: 'Desktop', value: 'desktop' },
	{ label: 'Mobile', value: 'mobile' },
	{ label: 'Tablet', value: 'tablet' },
	{ label: 'TV', value: 'tv' }
];

const sourceOptions = [
	{ label: 'twitter', value: 'twitter.com' },
	{ label: 'linkedin', value: 'linkedin.com' },
	{ label: 'vimeo', value: 'vimeo.com' },
	{ label: 'facebook', value: 'facebook.com' },
	{ label: 'other', value: 'other.com' }
];

const getFlagUrl = (countryCode: string) =>
	`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

export default function AnalyticsPage() {
	const router = useRouter();
	const { CompanyService } = useDla();
	const { authenticator } = useAuthenticator();
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [companyAnalytics, setCompanyAnalytics] = useState<ICompanyAnalytics>();
	const [showError, setShowError] = useState(false);
	const [filters, setFilters] = useState<ICompanyAnalyticsFilters>({
		startDate: undefined,
		endDate: undefined,
		contentType: '',
		source: '',
		device: '',
		country: ''
	});
	const [datePickerKey, setDatePickerKey] = useState(0);

	const hasActiveFilters = Object.values(filters).some(
		(value) => value !== undefined && value !== ''
	);

	const clearAllFilters = () => {
		setFilters({
			startDate: undefined,
			endDate: undefined,
			contentType: '',
			source: '',
			device: '',
			country: ''
		});
		setDatePickerKey((prev) => prev + 1);
	};

	const [selectedViewDuration, setSelectedViewDuration] = useState<string[]>([]);

	const fetchCompanyAnalytics = useCallback((): void => {
		setFetchInProgress(true);
		CompanyService.getAnalyticsByCompanyId(authenticator.user.companyId!, filters)
			.then((data: ICompanyAnalytics) => {
				setCompanyAnalytics(data);
				setFetchInProgress(false);
			})
			.catch(() => {
				setFetchInProgress(false);
				setShowError(true);
			});
	}, [CompanyService, authenticator.user.companyId, filters]);

	useEffect(() => {
		fetchCompanyAnalytics();
	}, [fetchCompanyAnalytics]);

	const highestViews = Math.max(...(companyAnalytics?.viewsChart?.map((d) => d.views) || []));
	const highlightedDate = companyAnalytics?.viewsChart?.find((d) => d.views === highestViews)?.date;

	const icon = (name: string) => {
		switch (name) {
			case 'twitter.com':
				return <FaTwitter color="#3388ff" size={20} />;
			case 'linkedin.com':
				return <FaLinkedin color="#3388ff" size={20} />;
			case 'vimeo.com':
				return <FaVimeo color="#3388ff" size={20} />;
			default:
				return <FaEllipsisH color="#3388ff" size={20} />;
		}
	};

	return (
		<>
			<ErrorModelWidget
				isOpen={showError}
				handleAction={() => router.push('/', { scroll: false })}
				handleClose={() => router.push('/', { scroll: false })}
				action="Try again later"
				description="Sorry, there was an unexpected error."
			/>

			<div className="w-full flex flex-col pt-[84px] bg-gray-925">
				{/* Filters - Always visible */}
				<div className="flex gap-3 w-full font-primary items-top font-medium text-[28px] text-white-100 px-6 py-6 flex-row justify-between">
					<div className="flex gap-3 items-center w-full">
						<DateRangePicker
							key={datePickerKey}
							onChange={(value) => {
								setFilters({
									...filters,
									startDate: value[0]?.getTime(),
									endDate: value[1]?.getTime()
								});
							}}
						/>

						<SelectOption
							placeholder="Type"
							options={ContentType}
							onChange={(value) => {
								setFilters({ ...filters, contentType: value[0] });
							}}
						/>
						<SelectOption
							placeholder="Source"
							options={sourceOptions}
							onChange={(value) => {
								setFilters({ ...filters, source: value[0] });
							}}
						/>
						<SelectOption
							placeholder="Device"
							options={deviceOptions}
							onChange={(value) => {
								setFilters({ ...filters, device: value[0] });
							}}
						/>
						<SelectOption
							placeholder="Region"
							options={countryOptions}
							onChange={(value) => {
								setFilters({ ...filters, country: value[0] });
							}}
						/>
						{hasActiveFilters && (
							<Button
								type="secondary"
								onClick={clearAllFilters}
								className="text-sm px-4 py-2 shrink-0"
							>
								Clear All
							</Button>
						)}
					</div>
				</div>

				{/* Content - Shows skeleton when loading */}
				{fetchInProgress ? (
					<AnalyticsSkeleton />
				) : (
					<>
						<div className="w-full grid grid-cols-4 py-2 px-6 pt-0 gap-4">
							<div className="group bg-yellow-900 rounded-lg p-6  hover:bg-gray-225">
								<div className="flex flex-col">
									<div className="flex items-center mb-6">
										<Icon
											name="billing"
											className="rounded-lg mr-4 p-2 bg-gray-925 fill-yellow-900 group-hover:fill-gray-225"
											size="medium"
										/>
										<span className="text-[14px] text-gray-775">TOTAL EARNINGS</span>
									</div>
									<div className="text-[64px] text-gray-775">
										{companyAnalytics?.totalEarnings !== undefined
											? formatCurrencyAmount(companyAnalytics.totalEarnings, 'USD')
											: '-'}
									</div>
								</div>
								<div className="flex gap-2 items-center">
									<div className="flex px-1 items-center border border-gray-775 group-hover:border-gray-950 rounded-full">
										<Icon
											name="chevron-up"
											size="small"
											className="pl-1 fill-gray-775 group-hover:fill-gray-950"
										></Icon>
										<label className="block m-2 text-[14px] text-gray-775  group-hover:text-gray-950 font-normal uppercase overflow-hidden">
											<span className="line-clamp-2">
												{numberToPercentage(companyAnalytics?.earningsChange)}
											</span>
										</label>
									</div>
									<label className="block m-2 pr-4 text-[8px] text-gray-775 group-hover:text-gray-950 font-extralight uppercase overflow-hidden">
										<span className="line-clamp-2">Change from previous period</span>
									</label>
								</div>
							</div>

							<div className="group bg-gray-800 rounded-lg p-6 hover:bg-gray-225 hover:text-gray-950">
								<div className="flex flex-col">
									<div className="flex items-center mb-6">
										<Icon
											name="clock"
											className="rounded-lg mr-4 p-2 bg-gray-925 fill-white-100 group-hover:fill-gray-225"
											size="medium"
										/>
										<span className="text-[14px] text-white-100 group-hover:text-gray-950">
											TOTAL TIME VIEWED
										</span>
									</div>
									<div className="text-[64px] text-white-100 group-hover:text-gray-950">
										{companyAnalytics?.totalWatchTime !== undefined
											? secondsToHHMMSS(companyAnalytics.totalWatchTime)
											: '-'}
									</div>
								</div>
								<div className="flex gap-2 items-center">
									<div className="flex px-1 items-center border border-green-200 group-hover:border-gray-775 rounded-full">
										<Icon
											name="chevron-up"
											size="small"
											className="pl-1 fill-green-200 group-hover:fill-gray-775"
										></Icon>
										<label className="block m-2 text-[14px] text-green-200  group-hover:text-gray-775 font-normal uppercase overflow-hidden">
											<span className="line-clamp-2">
												{numberToPercentage(companyAnalytics?.watchTimeChange)}
											</span>
										</label>
									</div>
									<label className="block m-2 pr-4 text-[8px] text-green-200  group-hover:text-gray-775 font-extralight uppercase overflow-hidden">
										<span className="line-clamp-2">Change from previous period</span>
									</label>
								</div>
							</div>

							<div className="group bg-gray-800 rounded-lg p-6 hover:bg-gray-225">
								<div className="flex flex-col">
									<div className="flex items-center mb-6">
										<Icon
											name="profile"
											className="rounded-lg mr-4 p-2 bg-gray-925 fill-white-100 group-hover:fill-gray-225"
											size="medium"
										/>
										<span className="text-[14px] text-white-100 group-hover:text-gray-950">
											UNIQUE VIEWERS
										</span>
									</div>
									<div className="text-[64px] text-white-100 group-hover:text-gray-950">
										{companyAnalytics?.uniqueViewers !== undefined
											? formatNumberUnitsWithSuffix(companyAnalytics.uniqueViewers)
											: '-'}
									</div>
								</div>
								<div className="flex gap-2 items-center">
									<div className="flex px-1 items-center border border-green-200 group-hover:border-gray-775 rounded-full">
										<Icon
											name="chevron-up"
											size="small"
											className="pl-1 fill-green-200 group-hover:fill-gray-775"
										></Icon>
										<label className="block m-2 text-[14px] text-green-200  group-hover:text-gray-775 font-normal uppercase overflow-hidden">
											<span className="line-clamp-2">
												{numberToPercentage(companyAnalytics?.uniqueViewersChange)}
											</span>
										</label>
									</div>
									<label className="block m-2 pr-4 text-[8px] text-green-200  group-hover:text-gray-775 font-extralight uppercase overflow-hidden">
										<span className="line-clamp-2">Change from previous period</span>
									</label>
								</div>
							</div>

							<div className="group bg-gray-800 rounded-lg p-6 hover:bg-gray-225">
								<div className="flex flex-col">
									<div className="flex items-center mb-6">
										<Icon
											name="eye"
											className="rounded-lg mr-4 p-2 bg-gray-925 fill-white-100 group-hover:fill-gray-225"
											size="medium"
										/>
										<span className="text-[14px] text-white-100 group-hover:text-gray-950">
											TOTAL VIEWS
										</span>
									</div>
									<div className="text-[64px] text-white-100 group-hover:text-gray-950">
										{companyAnalytics?.totalViews !== undefined
											? formatNumberUnitsWithSuffix(companyAnalytics.totalViews)
											: '-'}
									</div>
								</div>
								<div className="flex gap-2 items-center">
									<div className="flex px-1 items-center border border-green-200 group-hover:border-gray-775 rounded-full">
										<Icon
											name="chevron-up"
											size="small"
											className="pl-1 fill-green-200 group-hover:fill-gray-775"
										></Icon>
										<label className="block m-2 text-[14px] text-green-200  group-hover:text-gray-775 font-normal uppercase overflow-hidden">
											<span className="line-clamp-2">
												{numberToPercentage(companyAnalytics?.viewsChange)}
											</span>
										</label>
									</div>
									<label className="block m-2 pr-4 text-[8px] text-green-200  group-hover:text-gray-775 font-extralight uppercase overflow-hidden">
										<span className="line-clamp-2">Change from previous period</span>
									</label>
								</div>
							</div>
						</div>

						<div className="w-full grid grid-cols-1 py-2 px-6">
							<div className="bg-gray-800 rounded-lg py-6 px-0">
								<ResponsiveContainer width="100%" height={250}>
									<ComposedChart
										data={companyAnalytics?.viewsChart}
										margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
									>
										<CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
										<XAxis dataKey="date" stroke="#888" interval={0} />
										<YAxis stroke="#888" />
										<Tooltip />
										<Bar
											dataKey="views"
											stackId="b"
											radius={[5, 5, 0, 0]}
											background={{ fill: '#0B0905' }}
										>
											{companyAnalytics?.viewsChart?.map((entry, index) => (
												<Cell
													cursor="pointer"
													fill={entry.date === highlightedDate ? '#F3F305' : '#555'}
													key={`cell-${index}`}
												/>
											))}
										</Bar>

										{/* Line */}
										<Line
											type="monotone"
											dataKey="value"
											stroke="#00FFFF"
											strokeWidth={2}
											dot={{ fill: '#00FFFF', r: 4 }}
										/>
									</ComposedChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className="w-full grid grid-cols-2 py-2 px-6 gap-4">
							<div className="bg-gray-800 rounded-lg py-6 px-3">
								<div className="flex justify-between px-0 py-3  text-white-100 items-center uppercase">
									<p>Countries Performance</p>
								</div>

								{/* Table */}

								<table className="w-full text-left text-gray-300  border-gray-950 border-separate border-[4px] p-2 rounded-[8px]">
									{/* Table Header */}
									<thead className="text-gray-400 uppercase text-[10px]">
										<tr>
											<th className="px-4 py-2 w-[25%]">COUNTRY</th>
											<th className="px-1 pb-1">View Duration</th>
											<th className="px-1 pb-1">Total Views</th>
											<th className="px-1 pb-1">Unique Viewers</th>
										</tr>
									</thead>

									{/* Table Body */}
									<tbody>
										{companyAnalytics?.countriesData?.map((item, index) => (
											<tr
												key={index}
												className={`border-gray-700 hover:bg-gray-700 transition
											bg-gray-${index % 2 !== 0 ? '925' : '800'}
										   `}
											>
												<td className="px-4 py-2  items-center gap-2 rounded-l-lg">
													<span className="mr-2">
														{' '}
														<Image
															src={getFlagUrl(item.code)}
															alt={item.country}
															className="rounded-sm inline-block"
															width={20}
															height={12}
														/>
													</span>
													{item.country}
												</td>
												<td className="px-4 py-2 ">{item.viewDuration}</td>
												<td className="px-4 py-2">{item.totalViews}</td>
												<td className="px-4 py-2 text-green-200 rounded-r-lg">
													{item.uniqueViews}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							<div className="bg-gray-800 rounded-lg py-6 px-3">
								<div className="flex justify-between px-0 py-3  text-white-100 items-center">
									<p>DEVICES</p>
								</div>
								<div className="flex rounded-lg">
									{/* Left: Legend Table */}
									<div className="w-[55%] flex flex-col">
										<div className="flex justify-between px-0 pt-2 pb-6 border-b border-gray-950 text-gray-300 text-xs">
											<p>DEVICE</p>
											<p>VIEWS COUNT</p>
										</div>
										<div className="border-gray-950 border-[4px] p-2 rounded-[8px]">
											{companyAnalytics?.devicesData?.map((item, index) => (
												<div
													key={index}
													className={`flex justify-between items-center px-4 py-2 rounded-lg  hover:bg-gray-900 transition ${
														index % 2 !== 0 ? 'bg-gray-925' : ''
													}`}
												>
													<div className="flex items-center gap-2">
														<span
															className="w-3 h-3 rounded-full"
															style={{ background: item.fill }}
														></span>
														<p className="text-white-100 capitalize">{item.name}</p>
													</div>
													<p
														className={`text-white ${index === 0 ? 'text-green-200' : 'text-white-100'}`}
													>
														{item.views} VIEWS
													</p>
												</div>
											))}
										</div>
									</div>

									{/* Right: Radial Bar Chart */}
									<div className="w-[45%] flex justify-center items-center relative">
										<RadialBarChart
											width={280}
											height={280}
											cx="50%"
											cy="50%"
											innerRadius="35%"
											outerRadius="110%"
											barSize={15}
											data={companyAnalytics?.devicesData}
											startAngle={90}
											endAngle={-270}
										>
											<RadialBar
												label={false}
												background={{ fill: 'bg-gray-925' }}
												dataKey="value"
											/>
											<Tooltip />
										</RadialBarChart>

										{/* Centered Percentage & Name */}
										<div className="absolute text-center text-blue-400">
											<p className="text-3xl font-bold">
												{companyAnalytics?.devicesData?.[0]?.value}%
											</p>
											<p className="text-sm uppercase">
												{companyAnalytics?.devicesData?.[0]?.name}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="w-full grid grid-cols-1 py-2 px-6">
							<div className="bg-gray-800 rounded-lg py-6 px-4">
								<div className="flex justify-between px-0 py-3  text-white-100 items-center uppercase">
									<p>Source by URL</p>
								</div>

								{/* Table */}

								<table className="w-full text-left text-gray-300  border-gray-950 border-separate border-[4px] p-2 rounded-[8px]">
									{/* Table Header */}
									<thead className="text-gray-400 uppercase text-[10px]">
										<tr>
											<th className="px-4 py-2 w-[25%]">COUNTRY</th>
											<th className="px-1 pb-1">View Duration</th>
											<th className="px-1 pb-1">Unique Viewers</th>
											<th className="px-1 pb-1">Total Views</th>
										</tr>
									</thead>

									{/* Table Body */}
									<tbody>
										{companyAnalytics?.sourcesData?.map((item, index) => (
											<tr
												key={index}
												className={`border-gray-700 hover:bg-gray-700 transition
											bg-gray-${index % 2 !== 0 ? '925' : '800'}
										   `}
											>
												<td className="px-4 py-2   gap-2 rounded-l-lg flex items-center">
													<span className="mr-2 inline-block">{icon(item.name)}</span>
													{item.name}
												</td>
												<td className="px-4 py-2 ">{item.viewDuration}</td>
												<td className="px-4 py-2">{item.uniqueViews}</td>
												<td className="px-4 py-2 text-green-200 rounded-r-lg">{item.totalViews}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}
