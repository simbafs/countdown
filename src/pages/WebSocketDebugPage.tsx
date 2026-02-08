import { useCallback, useEffect, useRef, useState } from 'react'
import { MAX_LOGS } from '../constants'
import { useWebsocket } from '../hooks/useWebsocket'
import type { LogEntry } from '../types'

interface LogTableProps {
	logs: LogEntry[]
	columnHeader: string
}

function LogTable({ logs, columnHeader }: LogTableProps) {
	return (
		<table className="w-full text-sm font-mono">
			<thead className="sticky top-0 bg-gray-800 border-b border-gray-700">
				<tr>
					<th className="px-4 py-2 text-left text-gray-300 font-medium">Timestamp</th>
					<th className="px-4 py-2 text-left text-gray-300 font-medium">{columnHeader}</th>
					<th className="px-4 py-2 text-left text-gray-300 font-medium">Data</th>
				</tr>
			</thead>
			<tbody>
				{logs.map((log, index) => (
					<tr key={index} className="border-b border-gray-800 hover:bg-gray-800">
						<td className="px-4 py-2 text-gray-400 whitespace-nowrap">{log.timestamp}</td>
						<td className="px-4 py-2 text-cyan-300 whitespace-nowrap font-medium">{log.name}</td>
						<td className="px-4 py-2">
							<pre className="text-gray-300 text-xs overflow-x-auto whitespace-pre-wrap max-w-md text-left">
								{JSON.stringify(log.data, null, 2)}
							</pre>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default function WebSocketDebugPage() {
	const [logs, setLogs] = useState<LogEntry[]>([])
	const [websocketPath, setWebsocketPath] = useState('ws://localhost:4001/ws')
	const [isConnected, setIsConnected] = useState(false)
	const [activeView, setActiveView] = useState<'events' | 'tags'>('events')
	const [autoScroll, setAutoScroll] = useState(true)
	const logContainerRef = useRef<HTMLDivElement>(null)

	const addLog = useCallback((type: LogEntry['type'], name: string, data: unknown) => {
		const timestamp = new Date().toLocaleTimeString()
		setLogs(prev => {
			const newLogs = [...prev, { timestamp, type, name, data }]
			return newLogs.length > MAX_LOGS ? newLogs.slice(-MAX_LOGS) : newLogs
		})
	}, [])

	const handler = useCallback(() => {
		// We don't need to handle events here since we're using onMessage callback
		return false
	}, [])

	const onMessage = useCallback(
		(tag: string, payload: Record<string, unknown>) => {
			addLog('tag', tag, payload)
			if (tag === 'runtime-data') {
				for (const [event, data] of Object.entries(payload)) {
					addLog('event', event, data)
				}
			}
		},
		[addLog],
	)

	const { readyState } = useWebsocket(websocketPath, handler, {
		ignoreOtherTags: true,
		ignoreUnhandledEvents: true,
		onMessage,
	})

	useEffect(() => {
		setIsConnected(readyState === 1) // WebSocket.OPEN = 1
	}, [readyState])

	useEffect(() => {
		if (autoScroll && logContainerRef.current) {
			logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
		}
	}, [logs, autoScroll])

	const eventLogs = logs.filter(log => log.type === 'event')
	const tagLogs = logs.filter(log => log.type === 'tag')

	const clearLogs = () => setLogs([])

	const exportLogs = () => {
		const logData = JSON.stringify(logs, null, 2)
		const blob = new Blob([logData], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `websocket-logs-${new Date().toISOString()}.json`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	return (
		<div className="w-full max-w-screen-2xl mx-auto p-6">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">WebSocket Debug</h1>

			{/* Connection Controls */}
			<div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 pl-40">
				<div className="flex items-center space-x-4 mb-4">
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700 mb-1">WebSocket Path</label>
						<input
							type="text"
							value={websocketPath}
							onChange={e => setWebsocketPath(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="ws://localhost:4001/ws"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
						<span className="text-sm font-medium text-gray-700">
							{isConnected ? 'Connected' : 'Disconnected'}
						</span>
					</div>
				</div>

				{/* View Controls */}
				<div className="flex items-center space-x-4 mb-4">
					<div className="flex bg-gray-100 rounded-lg p-1">
						<button
							onClick={() => setActiveView('events')}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								activeView === 'events'
									? 'bg-white text-blue-600 shadow-sm'
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							Events ({eventLogs.length})
						</button>
						<button
							onClick={() => setActiveView('tags')}
							className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
								activeView === 'tags'
									? 'bg-white text-blue-600 shadow-sm'
									: 'text-gray-600 hover:text-gray-800'
							}`}
						>
							Tags ({tagLogs.length})
						</button>
					</div>
				</div>

				{/* Log Controls */}
				<div className="flex items-center justify-between">
					<div className="flex space-x-2">
						<button
							onClick={clearLogs}
							className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
						>
							Clear Logs
						</button>
						<button
							onClick={exportLogs}
							disabled={logs.length === 0}
							className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
						>
							Export Logs ({logs.length})
						</button>
					</div>

					{/* Auto-scroll toggle */}
					<div className="flex items-center space-x-2">
						<label className="flex items-center text-sm text-gray-700 cursor-pointer">
							<input
								type="checkbox"
								checked={autoScroll}
								onChange={e => setAutoScroll(e.target.checked)}
								className="mr-2 w-4 h-4"
							/>
							<span>Auto-scroll</span>
						</label>
						<span className="text-xs text-gray-500">(Max {MAX_LOGS} logs)</span>
					</div>
				</div>
			</div>

			{/* Logs Display */}
			<div ref={logContainerRef} className="bg-gray-900 rounded-lg p-4 h-128 overflow-auto">
				{activeView === 'events' ? (
					eventLogs.length === 0 ? (
						<div className="text-gray-400 text-center py-8">
							No events yet. Connect to a WebSocket source to see runtime-data events.
						</div>
					) : (
						<LogTable logs={eventLogs} columnHeader="Event" />
					)
				) : tagLogs.length === 0 ? (
					<div className="text-gray-400 text-center py-8">
						No tags yet. Connect to a WebSocket source to see top-level message tags.
					</div>
				) : (
					<LogTable logs={tagLogs} columnHeader="Tag" />
				)}
			</div>
		</div>
	)
}
