import { useRef } from 'react'
import { useDynamicTextSize } from '../hooks/useDynamicTextSize'
import type { TextShadow } from '../types'

interface TimerDisplayProps {
	text: string
	textShadow: TextShadow
}

export function TimerDisplay({ text, textShadow }: TimerDisplayProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const { fontSize, elementRef } = useDynamicTextSize({
		text,
		containerRef,
	})

	const shadowStyle = textShadow.enabled
		? `${textShadow.offsetX}px ${textShadow.offsetY}px ${textShadow.blurRadius}px ${textShadow.color}`
		: 'none'

	// BUG: the shadow will overflow
	return (
		<div ref={containerRef} className="text-black w-full h-full overflow-hidden flex items-center justify-center">
			<div
				ref={elementRef}
				className="font-mono font-bold tabular-nums leading-none whitespace-nowrap text-center"
				style={{
					fontSize: `${fontSize}px`,
					width: '100%',
					maxWidth: '100vw',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					textShadow: shadowStyle,
				}}
			>
				{text}
			</div>
		</div>
	)
}
