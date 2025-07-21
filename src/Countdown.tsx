import type { Display } from 'controly'
import { useEffect } from 'react'
import { useCountdown } from './hooks/useCountdown'

export default function Countdown({ display }: { display: Display }) {
	const { timeRemaining, startCountdown, pauseCountdown, resetCountdown, setMinute, setSecond } =
		useCountdown(display)

	useEffect(() => {
		display.command('start', startCountdown)
		display.command('pause', pauseCountdown)
		display.command('reset', resetCountdown)
		display.command('set_minute', ({ value = 0 }) => setMinute(value))
		display.command('set_second', ({ value = 0 }) => setSecond(value))
	}, [display, startCountdown, pauseCountdown, resetCountdown, setMinute, setSecond])

	// 將秒數格式化為 MM:SS
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0')
		const secs = (seconds % 60).toString().padStart(2, '0')
		return `${mins}:${secs}`
	}

	return <div className="font-mono text-[30vw] font-bold">{formatTime(timeRemaining)}</div>
}
