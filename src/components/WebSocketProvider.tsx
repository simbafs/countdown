import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import useWebSocket from 'react-use-websocket'
import type { WebSocketHandler, WebSocketMessage } from '../types'

interface WebSocketContextValue {
	send: (message: unknown) => void
	readyState: number
	isConnected: boolean
	registerHandler: (url: string, handler: WebSocketHandler, options?: WebSocketOptions) => void
	unregisterHandler: () => void
}

interface WebSocketOptions {
	ignoreOtherTags?: boolean
	ignoreUnhandledEvents?: boolean
	onMessage?: (tag: string, payload: Record<string, unknown>) => void
}

interface HandlerData {
	url: string
	handler: WebSocketHandler
	options: WebSocketOptions
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null)

interface WebSocketProviderProps {
	children: ReactNode
	defaultUrl?: string
}

export default function WebSocketProvider({ children, defaultUrl = 'ws://localhost:4001/ws' }: WebSocketProviderProps) {
	const [handlerData, setHandlerData] = useState<HandlerData | null>(null)
	const [currentUrl, setCurrentUrl] = useState(defaultUrl)

	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(currentUrl)

	const registerHandler = useCallback((url: string, handler: WebSocketHandler, options: WebSocketOptions = {}) => {
		setHandlerData({ url, handler, options })
		setCurrentUrl(url)
	}, [])

	const unregisterHandler = useCallback(() => {
		setHandlerData(null)
		setCurrentUrl(defaultUrl)
	}, [defaultUrl])

	useEffect(() => {
		if (!lastJsonMessage || !handlerData) return

		const message = lastJsonMessage as WebSocketMessage
		const { tag, payload } = message

		if (handlerData.options.onMessage) {
			handlerData.options.onMessage(tag, payload)
		}

		if (tag === 'runtime-data') {
			for (const [event, data] of Object.entries(payload)) {
				const handled = handlerData.handler(event, data)
				if (!handled && !handlerData.options.ignoreUnhandledEvents) {
					console.warn(`Unhandled event of ${tag}: ${event}`, data)
				}
			}
		} else if (!handlerData.options.ignoreOtherTags) {
			console.info(`Received message with tag: ${tag}`, payload)
		}
	}, [lastJsonMessage, handlerData])

	const contextValue: WebSocketContextValue = {
		send: sendJsonMessage,
		readyState,
		isConnected: readyState === 1,
		registerHandler,
		unregisterHandler,
	}

	return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}

export function useWebSocketContext() {
	const context = useContext(WebSocketContext)
	if (!context) {
		throw new Error('useWebSocketContext must be used within a WebSocketProvider')
	}
	return context
}
