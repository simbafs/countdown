import { useCallback, useRef, useState } from 'react'
import HoverMenu from '../components/HoverMenu'
import { useDynamicTextSize } from '../hooks/useDynamicTextSize'
import { useSetting } from '../hooks/useSetting'
import { useWebsocket } from '../hooks/useWebsocket'

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

interface AuxTimer {
	duration: number
	current: number
	playback: string
	direction: string
}

interface TextShadow {
	offsetX: number
	offsetY: number
	blurRadius: number
	color: string
	enabled: boolean
}

interface Settings {
	showHours: boolean
	websocketPath: string
	textShadow: TextShadow
	selectedTimer: 'main' | 'auxtimer1' | 'auxtimer2' | 'auxtimer3'
}

const defaultSettings: Settings = {
	showHours: true,
	websocketPath: 'ws://localhost:4001/ws',
	textShadow: {
		enabled: false,
		offsetX: 2,
		offsetY: 2,
		blurRadius: 4,
		color: '#000000',
	},
	selectedTimer: 'main',
}

export default function Timer() {
	const [timerData, setTimerData] = useState<TimerData | null>(null)
	const [auxTimers, setAuxTimers] = useState<Record<string, AuxTimer | null | undefined>>({
		auxtimer1: undefined,
		auxtimer2: undefined,
		auxtimer3: undefined,
	})
	const { setting: settings, setSetting } = useSetting<Settings>(defaultSettings)

	const activeTimerContainerRef = useRef<HTMLDivElement>(null)
	const placeholderContainerRef = useRef<HTMLDivElement>(null)

	const formatTime = (milliseconds: number): string => {
		const totalSeconds = Math.ceil(milliseconds / 1000)

		const isNegative = totalSeconds < 0
		const absSeconds = Math.abs(totalSeconds)

		const hours = Math.floor(absSeconds / 3600)
		const minutes = Math.floor((absSeconds % 3600) / 60)
		const seconds = absSeconds % 60

		const sign = isNegative ? '-' : ''

		if (settings.showHours) {
			return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
		}

		return `${sign}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	const getCurrentTimerData = () => {
		switch (settings.selectedTimer) {
			case 'auxtimer1':
				return auxTimers.auxtimer1
			case 'auxtimer2':
				return auxTimers.auxtimer2
			case 'auxtimer3':
				return auxTimers.auxtimer3
			default:
				return timerData
		}
	}

	const getTimerText = (timer: TimerData | AuxTimer | null | undefined): string => {
		if (!timer) return settings.showHours ? '--:--:--' : '--:--'
		return formatTime(timer.current)
	}

	const currentTimerData = getCurrentTimerData()
	const timerText = getTimerText(currentTimerData)
	const { fontSize: activeFontSize, elementRef: activeTimerRef } = useDynamicTextSize({
		text: timerText,
		minFontSize: 10,
		maxFontSize: 1000,
		containerRef: activeTimerContainerRef,
	})

	const placeholderText = settings.showHours ? '--:--:--' : '--:--'
	const { fontSize: placeholderFontSize, elementRef: placeholderRef } = useDynamicTextSize({
		text: placeholderText,
		minFontSize: 10,
		maxFontSize: 1000,
		containerRef: placeholderContainerRef,
	})

	const handler = useCallback((event: string, data: any) => {
		switch (event) {
			case 'timer':
				setTimerData(data as TimerData)
				return true
			case 'auxtimer1':
				setAuxTimers(prev => ({ ...prev, auxtimer1: data as AuxTimer }))
				return true
			case 'auxtimer2':
				setAuxTimers(prev => ({ ...prev, auxtimer2: data as AuxTimer }))
				return true
			case 'auxtimer3':
				setAuxTimers(prev => ({ ...prev, auxtimer3: data as AuxTimer }))
				return true
			default:
				return false
		}
	}, [])

	useWebsocket(settings.websocketPath, handler, {
		ignoreOtherTags: true,
		ignoreUnhandledEvents: true,
	})

	return (
		<div className="text-center w-full h-full overflow-hidden flex items-center justify-center relative">
			{/* Settings Options - Show on hover */}
			<HoverMenu position="top-right">
				<div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-6 min-w-64">
					<h3 className="text-black font-semibold mb-4">Settings</h3>

					{/* Show Hours Toggle */}
					<div className="mb-4">
						<label className="flex items-center text-black text-sm cursor-pointer">
							<input
								type="checkbox"
								checked={settings.showHours}
								onChange={e => setSetting({ showHours: e.target.checked })}
								className="mr-3 w-4 h-4"
							/>
							<span>Show Hours</span>
						</label>
					</div>

					{/* WebSocket Path */}
					<div className="mb-4">
						<label className="block text-black text-sm font-medium mb-2">WebSocket Path</label>
						<input
							type="text"
							value={settings.websocketPath}
							onChange={e => setSetting({ websocketPath: e.target.value })}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="ws://localhost:4001/ws"
						/>
					</div>

					{/* Text Shadow Controls */}
					<div className="mb-4">
						<label className="flex items-center text-black text-sm cursor-pointer mb-3">
							<input
								type="checkbox"
								checked={settings.textShadow.enabled}
								onChange={e => setSetting({ textShadow: { ...settings.textShadow, enabled: e.target.checked } })}
								className="mr-3 w-4 h-4"
							/>
							<span>Text Shadow</span>
						</label>

						{settings.textShadow.enabled && (
							<div className="space-y-3 ml-7">
								{/* Shadow Color */}
								<div>
									<label className="block text-black text-xs font-medium mb-1">Shadow Color</label>
									<input
										type="color"
										value={settings.textShadow.color}
										onChange={e => setSetting({ textShadow: { ...settings.textShadow, color: e.target.value } })}
										className="w-full h-8 border border-gray-300 rounded cursor-pointer"
									/>
								</div>

								{/* Offset X */}
								<div>
									<label className="block text-black text-xs font-medium mb-1">
										Offset X: {settings.textShadow.offsetX}px
									</label>
									<input
										type="range"
										min="-20"
										max="20"
										value={settings.textShadow.offsetX}
										onChange={e => setSetting({ textShadow: { ...settings.textShadow, offsetX: Number(e.target.value) } })}
										className="w-full"
									/>
								</div>

								{/* Offset Y */}
								<div>
									<label className="block text-black text-xs font-medium mb-1">
										Offset Y: {settings.textShadow.offsetY}px
									</label>
									<input
										type="range"
										min="-20"
										max="20"
										value={settings.textShadow.offsetY}
										onChange={e => setSetting({ textShadow: { ...settings.textShadow, offsetY: Number(e.target.value) } })}
										className="w-full"
									/>
								</div>

								{/* Blur Radius */}
								<div>
									<label className="block text-black text-xs font-medium mb-1">
										Blur Radius: {settings.textShadow.blurRadius}px
									</label>
									<input
										type="range"
										min="0"
										max="20"
										value={settings.textShadow.blurRadius}
										onChange={e => setSetting({ textShadow: { ...settings.textShadow, blurRadius: Number(e.target.value) } })}
										className="w-full"
									/>
								</div>
							</div>
						)}
					</div>

					{/* Timer Selection */}
					<div className="mb-4">
						<label className="block text-black text-sm font-medium mb-2">Timer Selection</label>
						<select
							value={settings.selectedTimer}
							onChange={e => setSetting({ selectedTimer: e.target.value as 'main' | 'auxtimer1' | 'auxtimer2' | 'auxtimer3' })}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="main">Main Timer</option>
							<option value="auxtimer1">Aux Timer 1</option>
							<option value="auxtimer2">Aux Timer 2</option>
							<option value="auxtimer3">Aux Timer 3</option>
						</select>
					</div>

					{/* Close hint */}
					<div className="text-gray-400 text-xs italic">Move cursor away to close</div>
				</div>
			</HoverMenu>

			{/* Timer Display */}
			{timerData ? (
				<div
					ref={activeTimerContainerRef}
					className="text-black w-full h-full overflow-hidden flex items-center justify-center"
				>
					<div
						ref={activeTimerRef}
						className="font-mono font-bold tabular-nums leading-none whitespace-nowrap text-center"
						style={{
							fontSize: `${activeFontSize}px`,
							width: '100%',
							maxWidth: '100vw',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							textShadow: settings.textShadow.enabled
								? `${settings.textShadow.offsetX}px ${settings.textShadow.offsetY}px ${settings.textShadow.blurRadius}px ${settings.textShadow.color}`
								: 'none',
						}}
					>
						{timerText}
					</div>
				</div>
			) : (
				<div
					ref={placeholderContainerRef}
					className="text-black w-full h-full overflow-hidden flex items-center justify-center"
				>
					<div
						ref={placeholderRef}
						className="font-mono font-bold tabular-nums leading-none whitespace-nowrap text-center"
						style={{
							fontSize: `${placeholderFontSize}px`,
							width: '100%',
							maxWidth: '100vw',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							textShadow: settings.textShadow.enabled
								? `${settings.textShadow.offsetX}px ${settings.textShadow.offsetY}px ${settings.textShadow.blurRadius}px ${settings.textShadow.color}`
								: 'none',
						}}
					>
						{placeholderText}
					</div>
				</div>
			)}
		</div>
	)
}
