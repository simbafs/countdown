export interface WebSocketMessage {
	tag: string
	payload: Record<string, unknown>
}

export type WebSocketHandler = (event: string, data: unknown) => boolean
