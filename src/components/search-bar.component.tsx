'use client';

import { Icon } from '@/components/icon/icon.component';
import { Button } from './button/button.component';
import { Input } from './input.component';

interface Props {
	navBarSearch?: boolean;
	showFilterButton?: boolean;
}

export function SearchBar(props: Props) {
	return (
		<>
			{props.navBarSearch ? (
				<div className="flex gap-4 items-center w-full pb-[5px]">
					<Input
						placeholder="Search for content"
						height="h-[36px]"
						border
						onChange={() => {}}
					></Input>
					<div className="pt-[5px]">
						<Button type="tertiary" className="h-[36px]">
							Search
						</Button>
					</div>
				</div>
			) : (
				<div className="flex gap-4 items-center w-full">
					<Input placeholder="ENTER THE SEARCH QUERY" onChange={() => {}}></Input>
					<div className="flex gap-4 pt-[5px]">
						<Button
							type="primary"
							iconColorType="primary-dark"
							bgColor="bg-green-800"
							textColor="text-white-100"
						>
							Search
						</Button>
						{props.showFilterButton && (
							<Button type="primary" iconColorType="primary-dark">
								<Icon name="filters" size="small" />
							</Button>
						)}
					</div>
				</div>
			)}
		</>
	);
}
