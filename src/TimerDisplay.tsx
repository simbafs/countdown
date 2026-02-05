import { useEffect, useRef, useState } from 'react'

interface TimerData {
	addedTime: number
	current: number
	duration: number
	elapsed: number
	expectedFinish: number
	phase: string
	playback: string
	secondaryTimer: null
	startedAt: number
}

interface WebSocketData {
	tag: string
	payload: {
		timer: TimerData
		clock: number
	}
}

interface Settings {
	showHours: boolean
	websocketPath: string
	roundingMode: 'ceil' | 'floor' | 'round'
}

export default function TimerDisplay() {
	const [timerData, setTimerData] = useState<TimerData | null>(null)
	const [settings, setSettings] = useState<Settings>({
		showHours: false,
		websocketPath: 'ws://192.168.1.171:4001/ws',
		roundingMode: 'ceil',
	})

	const [showSettingsButton, setShowSettingsButton] = useState(false)
	const wsRef = useRef<WebSocket | null>(null)
	const reconnectTimeoutRef = useRef<number | null>(null)

	const formatTime = (milliseconds: number): string => {
		let totalSeconds: number
		switch (settings.roundingMode) {
			case 'ceil':
				totalSeconds = Math.ceil(milliseconds / 1000)
				break
			case 'floor':
				totalSeconds = Math.floor(milliseconds / 1000)
				break
			case 'round':
				totalSeconds = Math.round(milliseconds / 1000)
				break
			default:
				totalSeconds = Math.ceil(milliseconds / 1000)
		}

		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60

		if (settings.showHours) {
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
		}

		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	const connect = () => {
		if (wsRef.current) {
			wsRef.current.close()
		}

		try {
			const ws = new WebSocket(settings.websocketPath)
			wsRef.current = ws

			ws.onopen = () => {
				console.log('Connected to WebSocket timer source')
			}

			ws.onmessage = event => {
				try {
					const data: WebSocketData = JSON.parse(event.data)

					if (data.tag === 'runtime-data' && data.payload.timer) {
						setTimerData(data.payload.timer)
					}
				} catch (error) {
					console.error('Error parsing WebSocket message:', error)
				}
			}

			ws.onerror = error => {
				console.error('WebSocket error:', error)
			}

			ws.onclose = () => {
				console.log('WebSocket connection closed')

				// Attempt to reconnect after 3 seconds
				reconnectTimeoutRef.current = window.setTimeout(() => {
					connect()
				}, 3000)
			}
		} catch (error) {
			console.error('Failed to create WebSocket connection:', error)
		}
	}

	useEffect(() => {
		// Load settings from query string
		const urlParams = new URLSearchParams(window.location.search)
		const showHours = urlParams.get('showHours') === 'true'
		const websocketPath = urlParams.get('websocketPath') || 'ws://192.168.1.171:4001/ws'
		const roundingMode = (urlParams.get('roundingMode') as 'ceil' | 'floor' | 'round') || 'ceil'

		setSettings({ showHours, websocketPath, roundingMode })
	}, [])

	useEffect(() => {
		// Save settings to query string when they change
		const url = new URL(window.location.href)
		url.searchParams.set('showHours', settings.showHours.toString())
		url.searchParams.set('websocketPath', settings.websocketPath)
		url.searchParams.set('roundingMode', settings.roundingMode)
		window.history.replaceState({}, '', url.toString())
	}, [settings])

	useEffect(() => {
		connect()

		return () => {
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current)
			}
			if (wsRef.current) {
				wsRef.current.close()
				wsRef.current = null
			}
		}
	}, [settings.websocketPath])

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current)
				reconnectTimeoutRef.current = null
			}
			if (wsRef.current) {
				wsRef.current.close()
				wsRef.current = null
			}
		}
	}, [])

	return (
		<div className="w-screen h-screen bg-white flex items-center justify-center p-4 relative">
			{/* Settings Options - Show on hover */}
			<div
				className="absolute top-4 right-4"
				onMouseEnter={() => setShowSettingsButton(true)}
				onMouseLeave={() => setShowSettingsButton(false)}
			>
				<div
					className={`transition-all duration-200 transform-gpu ${
						showSettingsButton ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
					}`}
				>
					<div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-6 min-w-64">
						<h3 className="text-black font-semibold mb-4">Settings</h3>

						{/* Show Hours Toggle */}
						<div className="mb-4">
							<label className="flex items-center text-black text-sm cursor-pointer">
								<input
									type="checkbox"
									checked={settings.showHours}
									onChange={e => setSettings({ ...settings, showHours: e.target.checked })}
									className="mr-3 w-4 h-4"
								/>
								<span>Show Hours</span>
							</label>
						</div>

						{/* Rounding Mode */}
						<div className="mb-4">
							<label className="block text-black text-sm font-medium mb-2">Rounding Mode</label>
							<select
								value={settings.roundingMode}
								onChange={e =>
									setSettings({
										...settings,
										roundingMode: e.target.value as 'ceil' | 'floor' | 'round',
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							>
								<option value="ceil">Ceil (Round Up)</option>
								<option value="floor">Floor (Round Down)</option>
								<option value="round">Round (Nearest)</option>
							</select>
						</div>

						{/* WebSocket Path */}
						<div className="mb-4">
							<label className="block text-black text-sm font-medium mb-2">WebSocket Path</label>
							<input
								type="text"
								value={settings.websocketPath}
								onChange={e => setSettings({ ...settings, websocketPath: e.target.value })}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="ws://192.168.1.171:4001/ws"
							/>
						</div>

						{/* Close hint */}
						<div className="text-gray-400 text-xs italic">Move cursor away to close</div>
					</div>
				</div>
			</div>

			{/* Timer Display */}
			<div className="text-center w-full h-full flex items-center justify-center">
				{timerData ? (
					<div className="text-black w-full overflow-hidden">
						<div
							className="font-mono font-bold tabular-nums leading-none whitespace-nowrap text-center"
							style={{
								fontSize: settings.showHours ? 'min(25vw, 25vh)' : 'min(45vw, 45vh)',
								width: '100%',
								maxWidth: '100vw',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							{formatTime(timerData.current)}
						</div>
					</div>
				) : (
					<div className="text-black w-full overflow-hidden">
						<div
							className="font-mono font-bold tabular-nums leading-none whitespace-nowrap text-center"
							style={{
								fontSize: settings.showHours ? 'min(25vw, 25vh)' : 'min(45vw, 45vh)',
								width: '100%',
								maxWidth: '100vw',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							{settings.showHours ? '--:--:--' : '--:--'}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
