export interface LogEntry {
	timestamp: string
	type: 'tag' | 'event'
	name: string
	data: unknown
}
