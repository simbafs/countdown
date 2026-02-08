import { useCallback, useEffect, useState } from 'react'
import { useWebsocket } from '../hooks/useWebsocket'

interface EventData {
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
		speaker: string
	}
	triggers: []
}

export default function Card() {
	useEffect(() => {
		// clear search parameters
		const url = new URL(window.location.href)
		url.search = ''
		window.history.replaceState({}, '', url.toString())
	}, [])

	const [eventData, setEventData] = useState<EventData | null>(null)

	const formatTime = (milliseconds: number): string => {
		const totalSeconds = Math.ceil(milliseconds / 1000)
		const hours = Math.floor(totalSeconds / 3600)
		const minutes = Math.floor((totalSeconds % 3600) / 60)
		const seconds = totalSeconds % 60

		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
	}

	const handler = useCallback((event: string, data: any) => {
		switch (event) {
			case 'eventNext':
				setEventData(data as EventData)
				return true
			default:
				return false
		}
	}, [setEventData])

	useWebsocket('ws://localhost:4001/ws', handler, {
		ignoreOtherTags: true,
		ignoreUnhandledEvents: true,
	})

	return (
		<div className="w-full h-full overflow-hidden flex items-center justify-center relative">
			{eventData ? (
				<div className="bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-2xl p-8 w-96 mx-auto backdrop-blur-sm">
					<div className="mb-4">
						<h1 className="text-2xl font-bold text-gray-800 leading-tight line-clamp-3 text-left">
							{eventData.title}
						</h1>
					</div>

					<div className="mb-6">
						<div className="font-mono text-lg text-gray-600 text-left">
							{formatTime(eventData.timeStart)} - {formatTime(eventData.timeEnd)}
						</div>
					</div>

					<div className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-3 border border-blue-200">
						<span className="text-sm font-medium text-blue-600">Speaker</span>
						<span className="text-lg font-semibold text-blue-800">
							{eventData.custom.speaker}
						</span>
					</div>
				</div>
			) : (
				<div className="text-gray-400 text-xl">Waiting for event data...</div>
			)}
		</div>
	)
}
