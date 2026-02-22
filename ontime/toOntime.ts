import { writeFileSync } from 'fs'
import type { Agenda } from './agenda.ts'
import type { OntimeEvent, OntimeOutput, OntimeRundown } from './ontime.ts'

type EventData = {
	id: string
	type: string
	title: string
	speaker?: string[]
	slideURL?: string
	hackmdURL?: string
	slidoID?: string
	room: string[]
	timeStart: number
	timeEnd: number
	note?: string
}

const agendaURL = 'https://sitcon.org/2026/sessions.json'

const agenda: Agenda = await fetch(agendaURL).then(res => res.json())

function convertSessionType(typeId: string, sessionTypes: Agenda['session_types']): string {
	const found = sessionTypes.find(t => t.id === typeId)
	return found?.zh.name ?? typeId
}

function convertSpeakers(speakerIds: string[], speakers: Agenda['speakers']): string[] {
	return speakerIds
		.map(id => {
			const speaker = speakers.find(s => s.id === id)
			return speaker?.zh.name
		})
		.filter((name): name is string => !!name)
}

function convertRooms(room: string, broadcast: string[] | null): string[] {
	const rooms = [room]
	if (broadcast) {
		rooms.push(...broadcast)
	}
	return [...new Set(rooms)]
}

function parseISOTime(isoString: string): number {
	const date = new Date(isoString)
	const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
	return date.getTime() - startOfDay.getTime()
}

function getColourForType(type: string): string {
	const typeColours: Record<string, string> = {
		Keynote: '#FF5722',
		Presentation: '#2196F3',
		開放式議程: '#9C27B0',
		合作議程: '#FF9800',
		Espresso: '#4CAF50',
		'Lightning Talk': '#00BCD4',
		Event: '#757575',
		論壇: '#E91E63',
	}
	return typeColours[type] || ''
}

function convertSessionToEventData(session: Agenda['sessions'][number]): EventData {
	const typeName = convertSessionType(session.type, agenda.session_types)
	const speakers = convertSpeakers(session.speakers, agenda.speakers)
	const rooms = convertRooms(session.room, session.broadcast)

	return {
		id: session.id,
		type: typeName,
		speaker: speakers.length > 0 ? speakers : undefined,
		title: session.zh.title,
		slideURL: session.slide ?? undefined,
		hackmdURL: session.co_write ?? undefined,
		slidoID: '#SITCON26-R0-1', // TODO: a mock Slido ID
		room: rooms,
		timeStart: parseISOTime(session.start),
		timeEnd: parseISOTime(session.end),
		note: '',
	}
}

function convertToOntimeEvent(event: EventData): OntimeEvent {
	const duration = event.timeEnd - event.timeStart
	const speakers = event.speaker?.join('、')

	return {
		id: event.id,
		type: 'event',
		flag: false,
		title: event.title,
		timeStart: event.timeStart,
		timeEnd: event.timeEnd,
		duration,
		timeStrategy: 'lock-duration',
		linkStart: true,
		endAction: 'none',
		timerType: 'count-down',
		countToEnd: false,
		skip: false,
		note: '',
		colour: getColourForType(event.type),
		delay: 0,
		dayOffset: 0,
		gap: 0,
		cue: '',
		parent: null,
		revision: 0,
		timeWarning: 120000,
		timeDanger: 60000,
		custom: {
			speaker: speakers || '',
			type: event.type,
			slideURL: event.slideURL || 'https://sitcon.org/2026', // TODO: a mock URL
			hackmdURL: event.hackmdURL || 'https://sitcon.org/2026', // TODO: a mock URL
			slidoID: event.slidoID || '',
		},
		triggers: [],
	}
}

const events: EventData[] = agenda.sessions.map(convertSessionToEventData)

const allRooms = new Set<string>()
for (const event of events) {
	for (const room of event.room) {
		allRooms.add(room)
	}
}

const roomRundowns: Record<string, OntimeRundown> = {}

function mergeConsecutiveEvents(events: EventData[]): EventData[] {
	if (events.length === 0) return []

	const merged: EventData[] = []
	let current = { ...events[0] }

	for (let i = 1; i < events.length; i++) {
		const next = events[i]

		if (next.title === current.title) {
			current.timeEnd = next.timeEnd
		} else {
			merged.push(current)
			current = { ...next }
		}
	}

	merged.push(current)
	return merged
}

for (const room of allRooms) {
	const roomEvents = events
		.filter(e => e.room.includes(room))
		.sort((a, b) => a.timeStart - b.timeStart)

	const mergedEvents = mergeConsecutiveEvents(roomEvents)

	const entries: Record<string, OntimeEvent> = {}
	const order: string[] = []
	const flatOrder: string[] = []

	for (const event of mergedEvents) {
		const ontimeEvent = convertToOntimeEvent(event)
		entries[event.id] = ontimeEvent
		order.push(event.id)
		flatOrder.push(event.id)
	}

	roomRundowns[room] = {
		id: room,
		title: room,
		order,
		flatOrder,
		entries,
		revision: 0,
	}
}

const ontimeOutput: OntimeOutput = {
	rundowns: roomRundowns,
	project: {
		title: 'SITCON 2026',
		description: '',
		url: '',
		info: '',
		logo: '',
		custom: [],
	},
	settings: {
		version: '4.4.2',
		serverPort: 4001,
		editorKey: '0328',
		operatorKey: '0328',
		timeFormat: '24',
		language: 'en',
	},
	viewSettings: {
		dangerColor: '#ff7300',
		normalColor: '#ffffffcc',
		overrideStyles: false,
		warningColor: '#ffa528',
	},
	urlPresets: [],
	customFields: {
		speaker: {
			type: 'text',
			colour: '',
			label: 'speaker',
		},
		type: {
			type: 'text',
			colour: '',
			label: 'type',
		},
		slideURL: {
			type: 'text',
			colour: '',
			label: 'slideURL',
		},
		hackmdURL: {
			type: 'text',
			colour: '',
			label: 'hackmdURL',
		},
		slidoID: {
			type: 'text',
			colour: '',
			label: 'slidoID',
		},
	},
	automation: {
		enabledAutomations: true,
		enabledOscIn: true,
		oscPortIn: 8888,
		triggers: [],
		automations: {},
	},
}

writeFileSync('sitcon2026.json', JSON.stringify(ontimeOutput, null, 2))

console.log('Generated script/ontime.json with rooms:', [...allRooms].join(', '))
