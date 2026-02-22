import type { CardSettings, TimerName, TimerSettings } from '../types'

export const DEFAULT_WEBSOCKET_PATH = 'ws://localhost:4001/ws'

export const DEFAULT_TEXT_SHADOW = {
	enabled: true,
	offsetX: 10,
	offsetY: 10,
	blurRadius: 20,
	color: '#808080',
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
	showHours: true,
	websocketPath: DEFAULT_WEBSOCKET_PATH,
	textShadow: DEFAULT_TEXT_SHADOW,
	selectedTimer: 'main' as TimerName,
}

export const DEFAULT_CARD_SETTINGS: CardSettings = {
	bg: false,
	websocketPath: DEFAULT_WEBSOCKET_PATH,
}
