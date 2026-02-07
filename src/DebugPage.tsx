import { useEffect, useState } from 'react'

export default function DebugPage() {
	const [debugInfo, setDebugInfo] = useState({
		webSocketStatus: 'disconnected',
		lastMessage: null,
		errorCount: 0,
		uptime: 0,
	})

	useEffect(() => {
		const interval = setInterval(() => {
			setDebugInfo(prev => ({
				...prev,
				uptime: prev.uptime + 1,
			}))
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	return (
		<div className="max-w-4xl mx-auto p-8">
			<h1 className="text-4xl font-bold text-gray-800 mb-6">Debug Information</h1>
			
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">System Status</h2>
					<div className="space-y-3">
						<div className="flex justify-between">
							<span className="text-gray-600">WebSocket:</span>
							<span className={`font-mono ${debugInfo.webSocketStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
								{debugInfo.webSocketStatus}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Uptime:</span>
							<span className="font-mono text-gray-800">{debugInfo.uptime}s</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Errors:</span>
							<span className="font-mono text-gray-800">{debugInfo.errorCount}</span>
						</div>
					</div>
				</div>

				<div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Application Info</h2>
					<div className="space-y-3">
						<div className="flex justify-between">
							<span className="text-gray-600">Router:</span>
							<span className="font-mono text-gray-800">React Router v7</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Build:</span>
							<span className="font-mono text-gray-800">Single File</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">CSS:</span>
							<span className="font-mono text-gray-800">Tailwind v4</span>
						</div>
					</div>
				</div>

				<div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 md:col-span-2">
					<h2 className="text-xl font-semibold text-gray-800 mb-4">Development Tools</h2>
					<div className="space-y-3">
						<div className="text-gray-700">
							<strong>Console:</strong> Check browser dev tools for WebSocket logs
						</div>
						<div className="text-gray-700">
							<strong>Network:</strong> Monitor WebSocket connection status
						</div>
						<div className="text-gray-700">
							<strong>Components:</strong> React DevTools available
						</div>
						<div className="text-gray-700">
							<strong>Hot Reload:</strong> Available in development mode
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}