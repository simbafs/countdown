import type { TimerName } from './timer'

export interface TextShadow {
	offsetX: number
	offsetY: number
	blurRadius: number
	color: string
	enabled: boolean
}

export interface TimerSettings {
	showHours: boolean
	websocketPath: string
	textShadow: TextShadow
	selectedTimer: TimerName
	[key: string]: unknown
}
