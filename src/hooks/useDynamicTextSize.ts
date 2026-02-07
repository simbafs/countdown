import { useCallback, useEffect, useRef, useState } from 'react'

interface UseDynamicTextSizeOptions {
	minFontSize?: number
	maxFontSize?: number
	containerRef?: React.RefObject<HTMLDivElement | null>
	text?: string
}

export const useDynamicTextSize = (options: UseDynamicTextSizeOptions = {}) => {
	const { minFontSize = 10, maxFontSize = 1000, containerRef, text = '' } = options

	const [fontSize, setFontSize] = useState(maxFontSize)
	const elementRef = useRef<HTMLDivElement>(null)
	const resizeObserverRef = useRef<ResizeObserver | null>(null)
	const debounceTimeoutRef = useRef<number | null>(null)

	// Debounced font size update
	const debouncedUpdateFontSize = useCallback(() => {
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current)
		}
		debounceTimeoutRef.current = window.setTimeout(() => {
			updateFontSize()
		}, 100) // 100ms debounce
	}, [])

	// Binary search to find the maximum font size that fits
	const findOptimalFontSize = (element: HTMLDivElement, container: HTMLElement): number => {
		let low = minFontSize
		let high = maxFontSize

		// Store original styles
		const originalWhiteSpace = element.style.whiteSpace
		const originalOverflow = element.style.overflow

		// Set necessary styles for accurate measurement
		element.style.whiteSpace = 'nowrap'
		element.style.overflow = 'hidden'

		while (low < high) {
			const mid = Math.floor((low + high + 1) / 2) // Round up to avoid infinite loop
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

		// Set final font size
		element.style.fontSize = `${low}px`

		// Restore original styles
		element.style.whiteSpace = originalWhiteSpace
		element.style.overflow = originalOverflow

		return low
	}

	const updateFontSize = () => {
		const element = elementRef.current
		const container = containerRef?.current || element?.parentElement

		if (!element || !container) {
			console.warn('DynamicTextSize: Missing element or container')
			return
		}

		const newFontSize = findOptimalFontSize(element, container as HTMLElement)
		setFontSize(newFontSize)
	}

	useEffect(() => {
		const element = elementRef.current
		const container = containerRef?.current || element?.parentElement

		if (!element || !container) return

		// Set up resize observer
		resizeObserverRef.current = new ResizeObserver(() => {
			debouncedUpdateFontSize()
		})

		resizeObserverRef.current.observe(container)
		resizeObserverRef.current.observe(element)

		// Also listen to window resize as a fallback
		const handleWindowResize = () => {
			debouncedUpdateFontSize()
		}
		window.addEventListener('resize', handleWindowResize)

		// Initial font size calculation
		updateFontSize()

		return () => {
			if (resizeObserverRef.current) {
				resizeObserverRef.current.disconnect()
			}
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current)
			}
			window.removeEventListener('resize', handleWindowResize)
		}
	}, []) // Empty dependency array - refs are stable and don't need to trigger re-runs

	// Update when text content changes
	useEffect(() => {
		updateFontSize()
	}, [text, minFontSize, maxFontSize])

	return {
		fontSize,
		elementRef,
		updateFontSize,
	}
}
