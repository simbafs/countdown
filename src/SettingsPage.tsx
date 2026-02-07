export default function SettingsPage() {
	return (
		<div className="max-w-2xl mx-auto p-8">
			<h1 className="text-4xl font-bold text-gray-800 mb-6">Application Settings</h1>
			<div className="text-lg text-gray-600 space-y-4">
				<p>
					This is a dedicated settings page for the timer application. Individual timer settings are available
					in the timer view.
				</p>
				<div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
					<h2 className="text-xl font-semibold text-gray-800 mb-3">Global Settings</h2>
					<div className="space-y-4">
						<div className="text-gray-700">
							<strong>Application Theme:</strong> Light mode
						</div>
						<div className="text-gray-700">
							<strong>Language:</strong> English
						</div>
						<div className="text-gray-700">
							<strong>Time Format:</strong> 24-hour
						</div>
						<div className="text-gray-700">
							<strong>Auto-save Settings:</strong> Enabled
						</div>
					</div>
				</div>
				<div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-semibold text-gray-800 mb-3">Information</h2>
					<ul className="space-y-2 text-gray-700">
						<li><strong>Version:</strong> 1.0.0</li>
						<li><strong>Build:</strong> Production</li>
						<li><strong>Framework:</strong> React + TypeScript</li>
						<li><strong>Styling:</strong> Tailwind CSS</li>
					</ul>
				</div>
			</div>
		</div>
	)
}