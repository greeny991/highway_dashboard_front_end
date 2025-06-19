'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/loader/loader.component';
import { ErrorModelWidget } from '@/widgets/error.widget';
import { useDla } from '@/contexts/dla.context';
import { IWatch } from '@/interfaces/watch.interface';
import Image from 'next/image';

export default function WatchPage(props: any) {
	const router = useRouter();
	const { WatchService } = useDla();
	const [fetchInProgress, setFetchInProgress] = useState(true);
	const [showError, setShowError] = useState(false);
	const [data, setData] = useState<IWatch>();

	useEffect(() => {
		setFetchInProgress(true);
		WatchService.getById(props.params.id)
			.then((data: IWatch) => {
				setData(data);
				setFetchInProgress(false);
			})
			.catch(() => {
				setShowError(true);
				setFetchInProgress(false);
			});
	}, []);

	return (
		<div className="@container w-full h-full">
			<ErrorModelWidget
				isOpen={showError}
				handleAction={() => router.push('/', { scroll: false })}
				handleClose={() => router.push('/', { scroll: false })}
				action="Try again later"
				description="Sorry, this video cannot be viewed now."
			/>

			{fetchInProgress && (
				<div className="fixed w-full h-full top-0 left-0 right-0 z-50">
					<Loader />
				</div>
			)}

			{!fetchInProgress && !showError && data && (
				<a target="_blank" href={`${process.env.NEXT_PUBLIC_BASE_APP_URL}/watch/${data.id}`}>
					<div className="relative z-9 w-full h-full cursor-pointer">
						<img
							src={`${process.env.NEXT_PUBLIC_CONTENT_FABRIC_BASE_URL_STATICS}${data.thumbnail}?width=1920`}
							className="absolute z-0 w-full h-full object-cover"
						/>
						<div className="h-1/4 w-full bg-gradient-to-b from-black to-transparent absolute z-1" />
						<div className="h-1/4 bottom-0 w-full bg-gradient-to-t from-black to-transparent absolute z-1" />

						<div className="relative w-full h-full flex flex-col justify-between gap-2 @2xl:gap-4 py-4 px-4 z-2">
							<div className="@xs:w-[72px] @sm:w-[82px] @md:w-[92px] @lg:w-[102px] @xl:w-[112px] @2xl:w-[122px] @3xl:w-[132px] @4xl:w-[142px] @5xl:w-[152px] @6xl:w-[162px] @7xl:w-[172px]">
								<div className="h-full w-full">
									<Image
										src="/images/logo-with-text-hiway.svg"
										alt="Hiway"
										height={40}
										width={130}
									/>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex flex-row items-center gap-2">
									<div className="border border-white-100 rounded-full bg-[url('/images/landing-bg.png')] bg-cover bg-center @xs:w-[16px] @xs:h-[16px] @sm:w-[17px] @sm:h-[17px] @md:w-[18px] @md:h-[18px] @lg:w-[19px] @lg:h-[19px] @xl:w-[20px] @xl:h-[20px] @2xl:w-[21px] @2xl:h-[21px] @3xl:w-[22px] @3xl:h-[22px] @4xl:w-[23px] @4xl:h-[23px] @5xl:w-[24px] @5xl:h-[24px] @6xl:w-[24px] @6xl:h-[24px] @7xl:w-[24px] @7xl:h-[24px]" />
									<p className="font-primary font-bold text-[10px] text-white-100 uppercase @xs:text-[10px] @sm:text-[11px] @md:text-[12px] @lg:text-[12px] @xl:text-[13px] @2xl:text-[14px] @3xl:text-[15px] @4xl:text-[16px] @5xl:text-[16px] @6xl:text-[17px] @7xl:text-[18px]">
										FLMCRW
									</p>
								</div>
								<p className="font-primary font-bold text-white-100 uppercase [14px] @xs:text-[16px] @sm:text-[19px] @md:text-[22px] @lg:text-[26px] @xl:text-[29px] @2xl:text-[32px] @3xl:text-[35px] @4xl:text-[38px] @5xl:text-[42px] @6xl:text-[45px] @7xl:text-[48px]">
									{data.displayName}
								</p>
							</div>
						</div>
					</div>
				</a>
			)}
		</div>
	);
}
