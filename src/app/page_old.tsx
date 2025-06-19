'use client';

import { ExplorePublisherItem } from '@/components/explore-publisher-item.component';
import { Loader } from '@/components/loader/loader.component';
import { useDla } from '@/contexts/dla.context';
import { ICompany } from '@/interfaces/company.interface';
import { NavBarExploreWidget } from '@/widgets/nav-bar-explore.widget';
import { useEffect, useState } from 'react';

export default function HomePage() {
	const { CompanyService } = useDla();
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [companies, setCompanies] = useState<ICompany[]>([]);

	useEffect(() => {
		CompanyService.getAllPublic()
			.then((companies: ICompany[]) => {
				setFetchInProgress(false);
				setCompanies(companies);
			})
			.catch((error) => {
				setFetchInProgress(false);
			});
	}, []);

	return (
		<>
			<div className="fixed top-0 left-0 right-0 z-10">
				<NavBarExploreWidget />
			</div>
			<div className="w-full h-full pt-[75px]">
				<p className="px-12 pt-8 pb-2 font-primary font-medium text-[28px] leading-[36px] text-white-100">
					Explore our exclusive publishers
				</p>
				<hr className="w-full h-px bg-white-10 border-0 rounded" />
				{fetchInProgress && (
					<div className="relative w-full h-full">
						<Loader backdrop={false} />
					</div>
				)}
				{!fetchInProgress && (
					<>
						{companies.length === 0 && (
							<div className="w-full flex p-4 justify-center text-white-60 items-center">
								Companies not found.
							</div>
						)}
						{companies.length > 0 && (
							<div className="w-full grid grid-cols-4 p-12 gap-6">
								{companies?.map((company, index) => (
									<ExplorePublisherItem key={index} company={company} />
								))}
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
}
