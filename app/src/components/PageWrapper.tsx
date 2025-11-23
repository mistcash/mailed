import { ReactNode } from 'react';
import Image from 'next/image';

interface PageWrapperProps {
	children: ReactNode;
	showLogo?: boolean;
	title?: string;
}

export default function PageWrapper({ children, showLogo = true, title }: PageWrapperProps) {
	return (
		<div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-rose-50 flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
				{showLogo && (
					<Image src="/logo.png" alt="mailMIST Logo" width={128} height={128} className="mx-auto mb-4" />
				)}
				{title && (
					<h3 className="text-3xl font-light mb-6 text-gray-900 text-center">{title}</h3>
				)}
				{children}
			</div>
		</div>
	);
}
