import React from 'react';

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	shareLink: string;
}

export default function SuccessModal({ isOpen, onClose, shareLink }: SuccessModalProps) {
	if (!isOpen) return null;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(shareLink);
		alert('Link copied to clipboard!');
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
				<div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
					<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>

				<h2 className="text-2xl font-bold text-center text-gray-900">
					Transaction Successful!
				</h2>

				<p className="text-center text-gray-600">
					Share this link with the recipient to claim their funds:
				</p>

				<div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
					<code className="text-sm text-gray-800 break-all block">
						{shareLink}
					</code>
				</div>

				<div className="flex gap-3">
					<button
						onClick={copyToClipboard}
						className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
					>
						Copy Link
					</button>
					<button
						onClick={onClose}
						className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
