import { useState } from 'react'

const COLOR_PALETTE = [
	'#000000',
	'#FFFFFF',
	'#FF0000',
	'#00FF00',
	'#0000FF',
	'#FFFF00',
	'#FF00FF',
	'#00FFFF',
	'#FFA500',
	'#800080',
	'#FFC0CB',
	'#A52A2A',
	'#808080',
	'#C0C0C0',
	'#FFD700',
	'#4B0082',
]

interface ColorPickerProps {
	label: string
	value: string
	onChange: (value: string) => void
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
	const [isOpen, setIsOpen] = useState(false)

	const handleColorSelect = (color: string) => {
		onChange(color)
		setIsOpen(false)
	}

	return (
		<div>
			<label className="block text-black text-xs font-medium mb-1">{label}</label>
			<div className="relative">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="w-full h-8 border border-gray-300 rounded flex items-center px-2 gap-2 hover:border-gray-400 transition-colors"
					type="button"
				>
					<div className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: value }} />
					<span className="text-xs text-gray-600 font-mono">{value.toUpperCase()}</span>
				</button>

				{isOpen && (
					<div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-3 z-50 w-48">
						<div className="grid grid-cols-4 gap-2">
							{COLOR_PALETTE.map(color => (
								<button
									key={color}
									onClick={() => handleColorSelect(color)}
									className={`w-8 h-8 rounded border-2 transition-all ${
										value === color
											? 'border-blue-500 scale-110'
											: 'border-gray-200 hover:border-gray-400'
									}`}
									style={{ backgroundColor: color }}
									type="button"
								/>
							))}
						</div>
						<div className="mt-2 pt-2 border-t border-gray-200">
							<label className="text-xs text-gray-600 block mb-1">Custom:</label>
							<div className="flex gap-2">
								<span className="text-gray-500 text-sm">#</span>
								<input
									type="text"
									value={value.replace('#', '')}
									onChange={e => {
										const hex = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6)
										onChange(`#${hex}`)
									}}
									className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono uppercase"
									maxLength={6}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
