import type { ReactNode } from 'react'
import { useState } from 'react'

interface HoverMenuProps {
	position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
	children: ReactNode
}

export default function HoverMenu({ position, children }: HoverMenuProps) {
	const [showMenu, setShowMenu] = useState(false)

	const getPositionClasses = () => {
		switch (position) {
			case 'top-left':
				return 'top-4 left-4'
			case 'top-right':
				return 'top-4 right-4'
			case 'bottom-left':
				return 'bottom-4 left-4'
			case 'bottom-right':
				return 'bottom-4 right-4'
			default:
				return 'top-4 left-4'
		}
	}

	return (
		<div
			className={`absolute ${getPositionClasses()}`}
			onMouseEnter={() => setShowMenu(true)}
			onMouseLeave={() => setShowMenu(false)}
		>
			<div
				className={`transition-all duration-200 transform-gpu ${
					showMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
				}`}
			>
				{children}
			</div>
		</div>
	)
}
