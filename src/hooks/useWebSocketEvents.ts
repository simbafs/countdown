import { useEffect } from 'react'
import { useWebSocketContext } from '../components/WebSocketProvider'
import type { WebSocketHandler } from '../types'

interface UseWebSocketEventsOptions {
	url: string
	handler: WebSocketHandler
	ignoreOtherTags?: boolean
	ignoreUnhandledEvents?: boolean
	onMessage?: (tag: string, payload: Record<string, unknown>) => void
}

export function useWebSocketEvents({
	url,
	handler,
	ignoreOtherTags = true,
	ignoreUnhandledEvents = true,
	onMessage,
}: UseWebSocketEventsOptions) {
	const { registerHandler, unregisterHandler } = useWebSocketContext()

	useEffect(() => {
		registerHandler(url, handler, {
			ignoreOtherTags,
			ignoreUnhandledEvents,
			onMessage,
		})

		return () => {
			unregisterHandler()
		}
	}, [url, handler, ignoreOtherTags, ignoreUnhandledEvents, onMessage, registerHandler, unregisterHandler])
}
