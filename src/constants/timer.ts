import type { TimerName } from '../types'

export const TIMER_NAMES: TimerName[] = ['main', 'auxtimer1', 'auxtimer2', 'auxtimer3']

export const TIMER_LABELS: Record<TimerName, string> = {
	main: 'Main Timer',
	auxtimer1: 'Aux Timer 1',
	auxtimer2: 'Aux Timer 2',
	auxtimer3: 'Aux Timer 3',
}

export const TIMER_EVENT_MAP: Record<TimerName, string> = {
	main: 'timer',
	auxtimer1: 'auxtimer1',
	auxtimer2: 'auxtimer2',
	auxtimer3: 'auxtimer3',
}
