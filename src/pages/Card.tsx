import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_WEBSOCKET_PATH } from '../constants'
import { useClearSreachParams } from '../hooks/useSetting'
import { useWebSocketContext } from '../components/WebSocketProvider'
import type { EventData } from '../types'
import { formatEventTime } from '../utils/time'

export default function Card() {
	useClearSreachParams()

	const [eventData, setEventData] = useState<EventData | null>(null)

	const handler = useCallback((event: string, data: unknown) => {
		if (event === 'eventNext') {
			setEventData(data as EventData)
			return true
		}
		return false
	}, [])

	const { registerHandler, unregisterHandler } = useWebSocketContext()

	useEffect(() => {
		registerHandler(DEFAULT_WEBSOCKET_PATH, handler, {
			ignoreOtherTags: true,
			ignoreUnhandledEvents: true,
		})

		return () => {
			unregisterHandler()
		}
	}, [handler, registerHandler, unregisterHandler])

	if (!eventData) {
		return (
			<div className="w-full h-full overflow-hidden flex items-center justify-center relative">
				<div className="text-gray-400 text-xl">Waiting for event data...</div>
			</div>
		)
	}

	return (
		<div className="w-full h-full overflow-hidden flex items-center justify-center relative">
			<div className="bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-2xl p-8 w-96 mx-auto backdrop-blur-sm">
				<div className="mb-4">
					<h1 className="text-2xl font-bold text-gray-800 leading-tight line-clamp-3 text-left">
						{eventData.title}
					</h1>
				</div>

				<div className="mb-6">
					<div className="font-mono text-lg text-gray-600 text-left">
						{formatEventTime(eventData.timeStart)} - {formatEventTime(eventData.timeEnd)}
					</div>
				</div>

				<div className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-3 border border-blue-200">
					<span className="text-sm font-medium text-blue-600">Speaker</span>
					<span className="text-lg font-semibold text-blue-800">{eventData.custom.speaker}</span>
				</div>
			</div>
		</div>
	)
}
