import { useCallback, useEffect, useState } from 'react'
import { useWebSocketContext } from '../components/WebSocketProvider'
import { DEFAULT_WEBSOCKET_PATH } from '../constants'
import { useClearSreachParams } from '../hooks/useSetting'
import type { EventData } from '../types'
import { formatEventTime } from '../utils/time'

export default function Card() {
	useClearSreachParams()

	const [eventData, setEventData] = useState<EventData | null>(null)

	const handler = useCallback((event: string, data: unknown) => {
		if (event === 'eventNow') {
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
			<div>
				<div>Waiting for event data...</div>
			</div>
		)
	}

	return (
		<div>
			<h1>{eventData.title}</h1>

			<div>
				{formatEventTime(eventData.timeStart)} - {formatEventTime(eventData.timeEnd)}
			</div>

			<div>
				<span>Speaker</span>
				<span>{eventData.custom.speaker}</span>
			</div>
		</div>
	)
}
