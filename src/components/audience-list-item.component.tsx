import { IAudience } from '@/interfaces/audience.interface';
import { formatCurrencyAmount } from '@/utils/format-currency-amount.util';
import { TimestampToDatetime } from '@/utils/timestamp-to-datetime.util';
import { useState, useRef, useEffect } from 'react';

interface Props {
	data: IAudience;
}

export function AudienceListItem(props: Props) {
	const [visibleImages, setVisibleImages] = useState<string[]>([]);
	const [remainingImagesCount, setRemainingImagesCount] = useState(0);
	const imageContainerRef = useRef<HTMLDivElement>(null);

	const getFormattedGenres = () => {
		const genres = props.data.genresLiked;
		const maxCharacters = 25;
		let truncatedGenres = '';
		let totalLength = 0;

		if (genres) {
			for (let i = 0; i < genres.length; i++) {
				let genre = genres[i];
				genre = genre[0].toUpperCase() + genre.substring(1);
				totalLength += genre.length;
				if (totalLength > maxCharacters) {
					truncatedGenres += '...';
					break;
				}
				truncatedGenres += i === 0 ? genre : `, ${genre}`;
			}

			return truncatedGenres;
		} else {
			return '--';
		}
	};

	const calculateVisibleImages = () => {
		const containerWidth = imageContainerRef.current?.offsetWidth || 0;
		const imageWidth = 102; // Width of each image in pixels
		const maxImages = Math.floor(containerWidth / imageWidth);

		if (props.data.purchasedPublication) {
			const purchasedPublicationsToBeShown = props.data.purchasedPublication.slice(0, maxImages);
			const thumbnails = purchasedPublicationsToBeShown.map((publication) => {
				return publication.thumbnail;
			});
			setVisibleImages(thumbnails);
			setRemainingImagesCount(props.data.purchasedPublication.length - maxImages);
		}
	};

	useEffect(() => {
		calculateVisibleImages();
		window.addEventListener('resize', calculateVisibleImages);

		return () => window.removeEventListener('resize', calculateVisibleImages);
	}, [props.data.purchasedPublication]);

	return (
		<>
			<tr>
				<td className="py-6 pl-6">{props.data.userEmail}</td>
				<td className="py-6 pl-6">
					{props.data.dateJoined ? TimestampToDatetime(props.data.dateJoined) : '--'}
				</td>
				{/* <td className="py-6 pl-6">
					{props.data.dateFollowed ? TimestampToDatetime(props.data.dateFollowed) : '--'}
				</td> */}
				<td className="py-6 pl-6">
					{formatCurrencyAmount(props.data.totalPaid ? props.data.totalPaid : 0, 'USD')}
				</td>
				<td className="py-6 pl-6">{getFormattedGenres()}</td>
				<td className="pt-4 pb-2 pl-6">
					<div className="flex items-center" ref={imageContainerRef}>
						{visibleImages.map((imageName, index) => (
							<div
								key={index}
								className="mr-3 relative overflow-hidden w-[102px] h-[70px] min-w-[102px]"
							>
								<img
									src={imageName}
									alt={`Purchased Media ${index + 1}`}
									className="w-full h-full object-cover rounded-[8px]"
								/>
							</div>
						))}
						{remainingImagesCount > 0 && (
							<span className="text-white-60 ml-2">+{remainingImagesCount} more...</span>
						)}
					</div>
				</td>
			</tr>
			<tr>
				<td colSpan={6} className="px-6">
					<div className="w-full h-[1px] bg-white-20"></div>
				</td>
			</tr>
		</>
	);
}
