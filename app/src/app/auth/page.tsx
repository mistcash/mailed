'use client';

import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const shouldRedirect = true;//location.href.indexOf('localhost') === -1;

function authRedirect(router: ReturnType<typeof useRouter>) {
	// Get the stored return path from sessionStorage
	const returnPath = sessionStorage.getItem('auth_return_path') || '/';
	sessionStorage.removeItem('auth_return_path');

	// Redirect to the stored path
	router.push(returnPath);
}

export default function AuthCallbackPage() {
	const { isAuthenticated, isLoading, user } = useAuth0();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			if (shouldRedirect) {
				authRedirect(router);
			}
		}
	}, [isAuthenticated, isLoading, router, user]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-cyan-50 via-blue-50 to-rose-50">
			<div className="text-center">
				{
					isLoading ?
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div> :
						<button onClick={() => authRedirect(router)}
							className="mx-auto my-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
						>Continue</button>
				}

				<p className="text-gray-700 font-medium">Completing authentication...</p>
			</div>
		</div>
	);
}
