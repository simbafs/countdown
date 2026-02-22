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
	custom: EventCustomData
	triggers: unknown[]
}

export interface EventCustomData {
	speaker?: string
	type?: string
	slideURL?: string
	hackmdURL?: string
	slidoID?: string
	[key: string]: unknown
}
