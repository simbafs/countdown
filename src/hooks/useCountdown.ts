import { useState, useEffect, useCallback } from 'react'
import type { Display } from 'controly'

interface CountdownStatus {
	minute: number
	second: number
	isCounting: boolean
}

export const useCountdown = (display: Display, initialTime: number = 5 * 60) => {
	const [initTime, setInitTime] = useState(initialTime)
	const [timeRemaining, setTimeRemaining] = useState(initialTime)
	const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null)

	const clearTimer = useCallback(() => {
		if (timer) {
			clearInterval(timer)
			setTimer(null)
		}
	}, [timer])

	const tick = useCallback(() => {
		setTimeRemaining(prev => {
			if (prev <= 1) {
				clearTimer()
				return 0
			}
			return prev - 1
		})
	}, [clearTimer])

	useEffect(() => {
		const status: CountdownStatus = {
			minute: Math.floor(timeRemaining / 60),
			second: timeRemaining % 60,
			isCounting: timer !== null,
		}
		display.updateStatus(status)
	}, [display, timeRemaining, timer])

	const startCountdown = useCallback(() => {
		if (timer) return
		tick()
		setTimer(setInterval(tick, 1000))
	}, [timer, tick])

	const pauseCountdown = useCallback(() => {
		clearTimer()
	}, [clearTimer])

	const resetCountdown = useCallback(() => {
		clearTimer()
		setTimeRemaining(initTime)
	}, [clearTimer, initTime])

	const setMinute = useCallback(
		(value: number) => {
			const newTime = value * 60 + (timeRemaining % 60)
			setInitTime(newTime)
			setTimeRemaining(newTime)
			clearTimer()
		},
		[timeRemaining, clearTimer],
	)

	const setSecond = useCallback(
		(value: number) => {
			const newTime = Math.floor(timeRemaining / 60) * 60 + value
			setInitTime(newTime)
			setTimeRemaining(newTime)
			clearTimer()
		},
		[timeRemaining, clearTimer],
	)

	return {
		timeRemaining,
		startCountdown,
		pauseCountdown,
		resetCountdown,
		setMinute,
		setSecond,
	}
}
