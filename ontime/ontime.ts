export interface OntimeEvent {
	id: string
	type: 'event'
	flag: boolean
	title: string
	timeStart: number
	timeEnd: number
	duration: number
	timeStrategy: 'lock-duration'
	linkStart: boolean
	endAction: 'none'
	timerType: 'count-down'
	countToEnd: boolean
	skip: boolean
	note: string
	colour: string
	delay: number
	dayOffset: number
	gap: number
	cue: string
	parent: string | null
	revision: number
	timeWarning: number
	timeDanger: number
	custom: Record<string, string>
	triggers: unknown[]
}

export interface OntimeRundown {
	id: string
	title: string
	order: string[]
	flatOrder: string[]
	entries: Record<string, OntimeEvent>
	revision: number
}

export interface OntimeProject {
	title: string
	description: string
	url: string
	info: string
	logo: string
	custom: unknown[]
}

export interface OntimeSettings {
	version: string
	serverPort: number
	editorKey: string
	operatorKey: string
	timeFormat: string
	language: string
}

export interface OntimeViewSettings {
	dangerColor: string
	normalColor: string
	overrideStyles: boolean
	warningColor: string
}

export interface OntimeCustomField {
	type: string
	colour: string
	label: string
}

export interface OntimeAutomation {
	enabledAutomations: boolean
	enabledOscIn: boolean
	oscPortIn: number
	triggers: unknown[]
	automations: unknown
}

export interface OntimeOutput {
	rundowns: Record<string, OntimeRundown>
	project: OntimeProject
	settings: OntimeSettings
	viewSettings: OntimeViewSettings
	urlPresets: unknown[]
	customFields: Record<string, OntimeCustomField>
	automation: OntimeAutomation
}
