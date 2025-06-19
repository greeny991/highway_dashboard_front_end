'use client';

import { AuthenticatorProvider } from '@/contexts/authenticator/authenticator.context';
import { DtoProvider } from '@/contexts/dto.context';
import { DlaProvider } from '@/contexts/dla.context';
import { HttpClientProvider } from '@/contexts/http-client/http-client.context';
import { HttpInterceptorProvider } from '@/contexts/http-client/http-interceptor.context';
import { MediaManagerProvider } from '@/contexts/media-manager.context';
import { UploadProvider } from '@/contexts/upload.context';

export function Providers({ children }: any) {
	return (
		<HttpClientProvider>
			<AuthenticatorProvider>
				<DtoProvider>
					<DlaProvider>
						<HttpInterceptorProvider>
							<MediaManagerProvider>
								<UploadProvider>{children}</UploadProvider>
							</MediaManagerProvider>
						</HttpInterceptorProvider>
					</DlaProvider>
				</DtoProvider>
			</AuthenticatorProvider>
		</HttpClientProvider>
	);
}
