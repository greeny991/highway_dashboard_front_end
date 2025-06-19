'use client';

import { useEffect, useState } from 'react';
// @ts-ignore: Unreachable code error
import { InitializeEluvioPlayer, EluvioPlayerParameters } from '@greenfishmedia/greenfish-player';
import { Loader } from '@/components/loader/loader.component';
import { PublicationRating } from '@/interfaces/publication.interface';

interface IControls {
	markInOut: boolean;
	previewMode: boolean;
	markInOutCallback?: (values: { in: number; out: number }) => void;
}

interface IContentInfo {
	title?: string;
	subtitle?: string;
	companyLogo?: string;
	rating?: PublicationRating;
}

interface Props {
	versionHash: string;
	offering: string;
	token: string;
	autoplay: boolean;
	controls: IControls;
	contentInfo?: IContentInfo;
	onReady?: (ready: boolean) => void;
	embedded?: boolean;
}

export function VideoPlayer(props: Props) {
	const [player, setPlayer] = useState<any>(undefined);

	function playerCallback({ player }: any) {
		if (props.onReady) {
			props.onReady(true);
		}
	}

	async function startVideo() {
		const targetContainerElement = document.getElementById('video-player');

		const player = await InitializeEluvioPlayer(targetContainerElement, {
			clientOptions: {
				network: EluvioPlayerParameters.networks.DEMO,
				// tenantId: 'iten25cvVcr17KWsjuHRkq3qW9sG2J7k'
				staticToken: props.token
			},
			sourceOptions: {
				playoutParameters: {
					versionHash: props.versionHash,
					offering: props.offering
					// authorizationToken: props.token
				},
				contentInfo: props.contentInfo || {}
			},
			playerOptions: {
				title: true,
				watermark: true,
				markInOut: props.controls.markInOut,
				markInOutCallback: props.controls.markInOutCallback || undefined,
				previewMode: props.controls.previewMode,
				autoplay: props.autoplay
					? EluvioPlayerParameters.autoplay.ON
					: EluvioPlayerParameters.autoplay.OFF,
				playerCallback
			}
		});
		setPlayer(player);
		player.UpdateContentInfo(props.contentInfo);
	}

	useEffect(() => {
		startVideo();
	}, [props.controls.markInOut]);

	useEffect(() => {
		if (player && props.controls.previewMode) {
			player.UpdateContentInfo(props.contentInfo);
		}
	}, [props.contentInfo]);

	return (
		<>
			<div className={`w-full h-full aspect-video ${props.embedded ? 'bg-gray-925' : ''} relative`}>
				<div id="video-player"></div>
				{!player && (
					<div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
						<Loader />
					</div>
				)}
			</div>
		</>
	);
}
