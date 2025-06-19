import { Icon } from '@/components/icon/icon.component';

export function AnalyticsSkeleton() {
	return (
		<>
			{/* Stats Cards Skeleton */}
			<div className="w-full grid grid-cols-4 py-2 px-6 pt-0 gap-4">
				{[...Array(4)].map((_, index) => (
					<div key={index} className="group bg-gray-800 rounded-lg p-6">
						<div className="flex flex-col">
							<div className="flex items-center mb-6">
								<div className="rounded-lg mr-4 p-2 bg-gray-925 w-10 h-10 animate-pulse" />
								<div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
							</div>
							<div className="h-16 w-48 bg-gray-700 rounded animate-pulse mb-4" />
							<div className="flex gap-2 items-center">
								<div className="h-6 w-24 bg-gray-700 rounded-full animate-pulse" />
								<div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Chart Skeleton */}
			<div className="w-full grid grid-cols-1 py-2 px-6">
				<div className="bg-gray-800 rounded-lg py-6 px-0">
					<div className="h-[250px] w-full bg-gray-700 rounded animate-pulse" />
				</div>
			</div>

			{/* Tables Skeleton */}
			<div className="w-full grid grid-cols-2 py-2 px-6 gap-4">
				{/* Countries Performance Skeleton */}
				<div className="bg-gray-800 rounded-lg py-6 px-3">
					<div className="flex justify-between px-0 py-3 text-white-100 items-center">
						<div className="h-6 w-48 bg-gray-700 rounded animate-pulse" />
					</div>
					<div className="space-y-2">
						{[...Array(5)].map((_, index) => (
							<div key={index} className="flex items-center gap-4 p-2">
								<div className="h-8 w-8 bg-gray-700 rounded animate-pulse" />
								<div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
								<div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
								<div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
								<div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
							</div>
						))}
					</div>
				</div>

				{/* Devices Skeleton */}
				<div className="bg-gray-800 rounded-lg py-6 px-3">
					<div className="flex justify-between px-0 py-3 text-white-100 items-center">
						<div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
					</div>
					<div className="flex">
						<div className="w-[55%] space-y-2">
							{[...Array(4)].map((_, index) => (
								<div key={index} className="flex items-center gap-4 p-2">
									<div className="h-4 w-4 bg-gray-700 rounded-full animate-pulse" />
									<div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
									<div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
								</div>
							))}
						</div>
						<div className="w-[45%] flex justify-center items-center">
							<div className="h-48 w-48 bg-gray-700 rounded-full animate-pulse" />
						</div>
					</div>
				</div>
			</div>

			{/* Sources Table Skeleton */}
			<div className="w-full grid grid-cols-1 py-2 px-6">
				<div className="bg-gray-800 rounded-lg py-6 px-4">
					<div className="flex justify-between px-0 py-3 text-white-100 items-center">
						<div className="h-6 w-48 bg-gray-700 rounded animate-pulse" />
					</div>
					<div className="space-y-2">
						{[...Array(5)].map((_, index) => (
							<div key={index} className="flex items-center gap-4 p-2">
								<div className="h-8 w-8 bg-gray-700 rounded animate-pulse" />
								<div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
								<div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
								<div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
								<div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
