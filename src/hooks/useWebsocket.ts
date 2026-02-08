import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'
import type { WebSocketHandler, WebSocketMessage } from '../types'

interface WebSocketOptions {
	ignoreOtherTags?: boolean
	ignoreUnhandledEvents?: boolean
	onMessage?: (tag: string, payload: Record<string, unknown>) => void
}

export { useWebSocketConnection as useWebsocket }

export function useWebSocketConnection(url: string, handler: WebSocketHandler, options: WebSocketOptions = {}) {
	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(url)

	useEffect(() => {
		if (!lastJsonMessage) return

		const message = lastJsonMessage as WebSocketMessage
		const { tag, payload } = message

		// Call the onMessage callback if provided (for debug page)
		if (options.onMessage) {
			options.onMessage(tag, payload)
		}

		if (tag === 'runtime-data') {
			for (const [event, data] of Object.entries(payload)) {
				const handled = handler(event, data)
				if (!handled && !options.ignoreUnhandledEvents) {
					console.warn(`Unhandled event of ${tag}: ${event}`, data)
				}
			}
		} else if (!options.ignoreOtherTags) {
			console.info(`Received message with tag: ${tag}`, payload)
		}
	}, [lastJsonMessage, handler, options])

	return {
		send: sendJsonMessage,
		readyState,
		isConnected: readyState === 1, // WebSocket.OPEN = 1
	}
}
