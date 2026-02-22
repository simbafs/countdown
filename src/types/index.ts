export type TimerName = 'main' | 'auxtimer1' | 'auxtimer2' | 'auxtimer3'

export interface TimerState {
	current: number
	duration: number
	playback: 'play' | 'pause' | 'stop'
}

export type TimersMap = Record<TimerName, number | undefined>

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

export interface EventData {
	id: string
	type: string
	flag: boolean
	title: string
	timeStart: number
	timeEnd: number
	duration: number
	timeStrategy: string
	linkStart: boolean
	endAction: string
	timerType: string
	countToEnd: boolean
	skip: boolean
	note: string
	colour: string
	delay: number
	dayOffset: number
	gap: number
	cue: string
	parent: string
	revision: number
	timeWarning: number
	timeDanger: number
	custom: {
		speaker?: string
		type?: string
		slideURL?: string
		hackmdURL?: string
		slidoID?: string
		[key: string]: unknown
	}
	triggers: unknown[]
}

export interface WebSocketMessage {
	tag: string
	payload: Record<string, unknown>
}

export type WebSocketHandler = (event: string, data: unknown) => boolean

export interface LogEntry {
	timestamp: string
	type: 'tag' | 'event'
	name: string
	data: unknown
}
