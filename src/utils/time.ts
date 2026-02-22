/**
 * Formats milliseconds into a time string (HH:MM:SS or MM:SS)
 */
export function formatTime(milliseconds: number, showHours = true): string {
	const totalSeconds = Math.ceil(milliseconds / 1000)
	const isNegative = totalSeconds < 0
	const absSeconds = Math.abs(totalSeconds)

	const hours = Math.floor(absSeconds / 3600)
	const minutes = Math.floor((absSeconds % 3600) / 60)
	const seconds = absSeconds % 60

	const sign = isNegative ? '-' : ''
	const paddedMinutes = minutes.toString().padStart(2, '0')
	const paddedSeconds = seconds.toString().padStart(2, '0')

	if (showHours) {
		const paddedHours = hours.toString().padStart(2, '0')
		return `${sign}${paddedHours}:${paddedMinutes}:${paddedSeconds}`
	}

	return `${sign}${paddedMinutes}:${paddedSeconds}`
}

/**
 * Formats milliseconds into a simple time string (HH:MM:SS)
 * Always shows hours, used for event display
 */
export function formatEventTime(milliseconds: number): string {
	const totalSeconds = Math.ceil(milliseconds / 1000)
	const hours = Math.floor(totalSeconds / 3600)
	const minutes = Math.floor((totalSeconds % 3600) / 60)
	// const seconds = totalSeconds % 60

	const paddedHours = hours.toString().padStart(2, '0')
	const paddedMinutes = minutes.toString().padStart(2, '0')
	// const paddedSeconds = seconds.toString().padStart(2, '0')

	return `${paddedHours}:${paddedMinutes}`
	// return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
}

/**
 * Gets the placeholder text for a timer based on whether hours are shown
 */
export function getTimerPlaceholder(showHours: boolean): string {
	return showHours ? '--:--:--' : '--:--'
}
