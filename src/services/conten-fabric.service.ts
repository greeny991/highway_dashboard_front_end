// @ts-ignore:next-line
import { ElvClient } from '@eluvio/elv-client-js';
import { IContentFabricFile } from '@/interfaces/content-fabric.interface';

export default class ContentFabricService {
	private client: ElvClient;

	constructor() {}

	async createInstance(params: { node: string; token: string }) {
		this.client = await ElvClient.FromNetworkName({
			networkName: process.env.NEXT_PUBLIC_CONTENT_FABRIC_NETWORK_NAME
		});
		this.client.SetNodes({ fabricURIs: [params.node] });
		this.client.SetStaticToken({ token: params.token, update: true });
		this.client.ToggleLogging(false);
	}

	async upload(params: {
		files: IContentFabricFile[];
		objectId: string;
		libraryId: string;
		writeToken: string;
	}): Promise<boolean> {
		try {
			console.log('Starting upload to Content Fabric...');
			console.log('Upload parameters:', params);

			const result = await this.client.UploadFiles({
				libraryId: params.libraryId,
				objectId: params.objectId,
				writeToken: params.writeToken,
				encrypted: false,
				encryption: 'none',
				fileInfo: params.files
			});

			console.log('Upload successful. Result:', result);
			return true;
		} catch (err) {
			console.error('Error uploading files to Content Fabric:', err);
			return false;
		}
	}
}
