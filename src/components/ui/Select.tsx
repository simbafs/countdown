import { useState } from 'react'

interface SelectOption {
	value: string
	label: string
}

interface SelectProps {
	label: string
	value: string
	options: SelectOption[]
	onChange: (value: string) => void
}

export function Select({ label, value, options, onChange }: SelectProps) {
	const [isOpen, setIsOpen] = useState(false)

	const selectedOption = options.find(opt => opt.value === value)

	const handleSelect = (optionValue: string) => {
		onChange(optionValue)
		setIsOpen(false)
	}

	return (
		<div className="mb-4">
			<label className="block text-black text-sm font-medium mb-2">{label}</label>
			<div className="relative">
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between"
					type="button"
				>
					<span>{selectedOption?.label ?? value}</span>
					<svg
						className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				{isOpen && (
					<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
						{options.map(option => (
							<button
								key={option.value}
								onClick={() => handleSelect(option.value)}
								className={`w-full px-3 py-2 text-left text-sm transition-colors ${
									value === option.value
										? 'bg-blue-100 text-blue-700'
										: 'text-gray-700 hover:bg-gray-100'
								}`}
								type="button"
							>
								{option.label}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
