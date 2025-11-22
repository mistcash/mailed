'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode } from 'react';

export default function Auth0ProviderWrapper({ children }: { children: ReactNode }) {
	const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
	const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '';

	if (typeof window === 'undefined') {
		return <>{children}</>;
	}

	return (
		<Auth0Provider
			domain={domain}
			clientId={clientId}
			authorizationParams={{
				redirect_uri: window.location.href,
				connection: 'google-oauth2',
			}}
		>
			{children}
		</Auth0Provider>
	);
}
