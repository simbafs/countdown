import type { Display } from 'controly'
import { useEffect, useState } from 'react'

export default function Countdown({ display }: { display: Display }) {
	// 總剩餘秒數
	const [initTime, setInitTime] = useState(5 * 60) // 預設 5 分鐘
	const [timeRemaining, setTimeRemaining] = useState(5 * 60) // 預設 5 分鐘
	const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(null)

	useEffect(() => {
		const status = {
			minute: Math.floor(timeRemaining / 60),
			second: timeRemaining % 60,
			isCounting: timer !== null,
		}
		display.updateStatus(status)
	}, [display, timeRemaining, timer])

	useEffect(() => {
		const tick = () => {
			if (timeRemaining <= 0) {
				clear()
			} else {
				setTimeRemaining(prev => prev - 1)
			}
		}

		const clear = () => {
			clearInterval(timer!)
			setTimer(null)
		}

		// 開始計時
		const handleStart = () => {
			if (timer) return
			setTimer(setInterval(tick, 1000))
		}

		// 暫停計時
		const handlePause = () => {
			clear()
		}

		// 設定時間
		const handleSetMinute = ({ value = 0 } = {}) => {
			const minute = value
			const second = timeRemaining % 60
			setInitTime(minute * 60 + second)
			handleReset()
		}
		const handleSecond = ({ value = 0 } = {}) => {
			const minute = Math.floor(timeRemaining / 60)
			const second = value
			setInitTime(minute * 60 + second)
			handleReset()
		}

		const handleReset = () => {
			clear()
			setTimeRemaining(initTime)
		}
		display.command('start', handleStart)
		display.command('pause', handlePause)
		display.command('reset', handleReset)
		display.command('set_minute', handleSetMinute)
		display.command('set_second', handleSecond)
	}, [display, initTime, timeRemaining])

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
