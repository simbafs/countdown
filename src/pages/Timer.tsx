import { useCallback, useMemo, useState } from 'react'
import HoverMenu from '../components/HoverMenu'
import { SettingsPanel } from '../components/SettingsPanel'
import { TimerDisplay } from '../components/TimerDisplay'
import { DEFAULT_TIMER_SETTINGS } from '../constants'
import { useSetting } from '../hooks/useSetting'
import { useWebsocket } from '../hooks/useWebsocket'
import type { TimerName, TimersMap } from '../types'
import { formatTime, getTimerPlaceholder } from '../utils/time'

const TIMER_EVENT_MAP: Record<TimerName, string> = {
	main: 'timer',
	auxtimer1: 'auxtimer1',
	auxtimer2: 'auxtimer2',
	auxtimer3: 'auxtimer3',
}

const INITIAL_TIMERS: TimersMap = {
	main: undefined,
	auxtimer1: undefined,
	auxtimer2: undefined,
	auxtimer3: undefined,
}

export default function Timer() {
	const [timers, setTimers] = useState<TimersMap>(INITIAL_TIMERS)
	const { setting: settings, setSetting } = useSetting(DEFAULT_TIMER_SETTINGS)

	const currentTimerValue = timers[settings.selectedTimer]

	const timerText = useMemo(() => {
		if (currentTimerValue === undefined) {
			return getTimerPlaceholder(settings.showHours)
		}
		return formatTime(currentTimerValue, settings.showHours)
	}, [currentTimerValue, settings.showHours])

	const handler = useCallback((event: string, data: unknown) => {
		if (!data || typeof data !== 'object') return false

		const timerData = data as { current?: number }

		switch (event) {
			case TIMER_EVENT_MAP.main:
				setTimers(prev => ({ ...prev, main: timerData.current }))
				return true
			case TIMER_EVENT_MAP.auxtimer1:
				setTimers(prev => ({ ...prev, auxtimer1: timerData.current }))
				return true
			case TIMER_EVENT_MAP.auxtimer2:
				setTimers(prev => ({ ...prev, auxtimer2: timerData.current }))
				return true
			case TIMER_EVENT_MAP.auxtimer3:
				setTimers(prev => ({ ...prev, auxtimer3: timerData.current }))
				return true
			default:
				return false
		}
	}, [])

	useWebsocket(settings.websocketPath, handler, {
		ignoreOtherTags: true,
		ignoreUnhandledEvents: true,
	})

	return (
		<div className="text-center w-full h-full overflow-hidden flex items-center justify-center relative">
			<HoverMenu position="top-right">
				<SettingsPanel settings={settings} onSettingChange={setSetting} />
			</HoverMenu>

			<TimerDisplay text={timerText} textShadow={settings.textShadow} />
		</div>
	)
}
