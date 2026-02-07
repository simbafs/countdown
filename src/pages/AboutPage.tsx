export default function AboutPage() {
	return (
		<div className="max-w-2xl mx-auto p-8">
			<h1 className="text-4xl font-bold text-gray-800 mb-6">About Timer Display</h1>
			<div className="text-lg text-gray-600 space-y-4">
				<p>
					This is a professional timer display application that connects to WebSocket sources for real-time
					timer updates.
				</p>
				<div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-semibold text-gray-800 mb-3">Features</h2>
					<ul className="list-disc list-inside space-y-2 text-gray-700">
						<li>Real-time WebSocket connectivity</li>
						<li>Multiple timer support (main + 3 auxiliary timers)</li>
						<li>Dynamic text sizing for optimal display</li>
						<li>Customizable text shadows and styling</li>
						<li>URL-persisted settings</li>
						<li>Transparent background for overlay usage</li>
					</ul>
				</div>
				<div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
					<h2 className="text-xl font-semibold text-gray-800 mb-3">Usage</h2>
					<p className="text-gray-700">
						Configure the WebSocket endpoint to connect to your timer source. The application will
						automatically handle reconnections and display the timer data in real-time.
					</p>
				</div>
			</div>
		</div>
	)
}
