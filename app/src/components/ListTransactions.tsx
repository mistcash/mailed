import React from 'react';

export interface SavedLink {
	link: string;
	email: string;
	amount: string;
	date: string;
}

interface ListTransactionsProps {
	transactions: SavedLink[];
}

export default function ListTransactions({ transactions }: ListTransactionsProps) {
	const copyLink = (link: string) => {
		navigator.clipboard.writeText(link);
		alert('Link copied to clipboard!');
	};

	if (transactions.length === 0) {
		return null;
	}

	return (
		<div className="mt-8 space-y-3">
			<h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
			<div className="space-y-2">
				{transactions.map((item, index) => (
					<div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
						<div className="flex justify-between items-center gap-4">
							<code className="text-xs text-gray-700 break-all flex-1">
								{item.link}
							</code>
							<div className="flex items-center gap-3 flex-shrink-0">
								<span className="text-xs text-gray-600">
									{new Date(item.date).toLocaleDateString()}
								</span>
								<button
									onClick={() => copyLink(item.link)}
									className="text-cyan-600 hover:text-cyan-700 text-xs font-medium"
								>
									Copy
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
