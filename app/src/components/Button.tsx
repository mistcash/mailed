export default function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
	return (
		<button
			onClick={onClick}
			className="w-full px-6 py-3 bg-linear-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
		>
			{children}
		</button>
	);
}