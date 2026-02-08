import { useCallback, useEffect, useRef, useState } from 'react'
import { DEBOUNCE_DELAY, FONT_SIZE_CONSTRAINTS } from '../constants'

interface UseDynamicTextSizeOptions {
	text?: string
	minFontSize?: number
	maxFontSize?: number
	containerRef?: React.RefObject<HTMLElement | null>
}

interface UseDynamicTextSizeReturn {
	fontSize: number
	elementRef: React.RefObject<HTMLDivElement | null>
}

export function useDynamicTextSize(options: UseDynamicTextSizeOptions = {}): UseDynamicTextSizeReturn {
	const {
		text = '',
		minFontSize = FONT_SIZE_CONSTRAINTS.min,
		maxFontSize = FONT_SIZE_CONSTRAINTS.max,
		containerRef,
	} = options

	const [fontSize, setFontSize] = useState(maxFontSize)
	const elementRef = useRef<HTMLDivElement>(null)
	const resizeObserverRef = useRef<ResizeObserver | null>(null)
	const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const updateFontSize = useCallback(() => {
		const element = elementRef.current
		const container = containerRef?.current ?? element?.parentElement

		if (!element || !container) {
			console.warn('DynamicTextSize: Missing element or container')
			return
		}

		const newFontSize = calculateOptimalFontSize(element, container, minFontSize, maxFontSize)
		setFontSize(newFontSize)
	}, [containerRef, minFontSize, maxFontSize])

	const debouncedUpdateFontSize = useCallback(() => {
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current)
		}
		debounceTimeoutRef.current = setTimeout(updateFontSize, DEBOUNCE_DELAY)
	}, [updateFontSize])

	// Set up resize observer and window resize listener
	useEffect(() => {
		const element = elementRef.current
		const container = containerRef?.current ?? element?.parentElement

		if (!element || !container) return

		resizeObserverRef.current = new ResizeObserver(debouncedUpdateFontSize)
		resizeObserverRef.current.observe(container)
		resizeObserverRef.current.observe(element)

		const handleWindowResize = debouncedUpdateFontSize
		window.addEventListener('resize', handleWindowResize)

		// Initial calculation
		updateFontSize()

		return () => {
			resizeObserverRef.current?.disconnect()
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current)
			}
			window.removeEventListener('resize', handleWindowResize)
		}
	}, [containerRef, debouncedUpdateFontSize, updateFontSize])

	// Update when text or font constraints change
	useEffect(() => {
		updateFontSize()
	}, [text, minFontSize, maxFontSize, updateFontSize])

	return { fontSize, elementRef }
}

function calculateOptimalFontSize(
	element: HTMLElement,
	container: HTMLElement,
	minSize: number,
	maxSize: number,
): number {
	// Store original styles
	const originalWhiteSpace = element.style.whiteSpace
	const originalOverflow = element.style.overflow

	// Set measurement styles
	element.style.whiteSpace = 'nowrap'
	element.style.overflow = 'hidden'

	let low = minSize
	let high = maxSize

	while (low < high) {
		const mid = Math.floor((low + high + 1) / 2)
		element.style.fontSize = `${mid}px`

		const elementWidth = element.scrollWidth
		const containerWidth = container.clientWidth
		const elementHeight = element.scrollHeight
		const containerHeight = container.clientHeight

		if (elementWidth <= containerWidth && elementHeight <= containerHeight) {
			low = mid
		} else {
			high = mid - 1
		}
	}

	// Apply padding for aesthetics
	const finalSize = Math.max(minSize, low - 20)

	// Restore original styles
	element.style.whiteSpace = originalWhiteSpace
	element.style.overflow = originalOverflow
	element.style.fontSize = `${finalSize}px`

	return finalSize
}
