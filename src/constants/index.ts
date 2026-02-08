import type { TimerName } from '../types'

export const DEFAULT_WEBSOCKET_PATH = 'ws://localhost:4001/ws'

export const TIMER_NAMES: TimerName[] = ['main', 'auxtimer1', 'auxtimer2', 'auxtimer3']

export const TIMER_LABELS: Record<TimerName, string> = {
	main: 'Main Timer',
	auxtimer1: 'Aux Timer 1',
	auxtimer2: 'Aux Timer 2',
	auxtimer3: 'Aux Timer 3',
}

export const DEFAULT_TEXT_SHADOW = {
	enabled: true,
	offsetX: 10,
	offsetY: 10,
	blurRadius: 20,
	color: '#808080',
}

export const DEFAULT_TIMER_SETTINGS = {
	showHours: true,
	websocketPath: DEFAULT_WEBSOCKET_PATH,
	textShadow: DEFAULT_TEXT_SHADOW,
	selectedTimer: 'main' as TimerName,
}

export const MAX_LOGS = 200

export const FONT_SIZE_CONSTRAINTS = {
	min: 10,
	max: 1000,
}

export const DEBOUNCE_DELAY = 100
