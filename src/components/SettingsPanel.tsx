import { useState } from 'react'
import { TIMER_LABELS, TIMER_NAMES } from '../constants'
import type { TextShadow, TimerName, TimerSettings } from '../types'

interface SettingsPanelProps {
	settings: TimerSettings
	onSettingChange: (updates: Partial<TimerSettings>) => void
}

export function SettingsPanel({ settings, onSettingChange }: SettingsPanelProps) {
	const handleTextShadowChange = (updates: Partial<TextShadow>) => {
		onSettingChange({
			textShadow: { ...settings.textShadow, ...updates },
		})
	}

	return (
		<div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-6 min-w-64">
			<h3 className="text-black font-semibold mb-4">Settings</h3>

			<CheckboxSetting
				label="Show Hours"
				checked={settings.showHours}
				onChange={checked => onSettingChange({ showHours: checked })}
			/>

			<TextSetting
				label="WebSocket Path"
				value={settings.websocketPath}
				onChange={value => onSettingChange({ websocketPath: value })}
				placeholder="ws://localhost:4001/ws"
			/>

			<TextShadowSettings textShadow={settings.textShadow} onChange={handleTextShadowChange} />

			<TimerSelector
				selectedTimer={settings.selectedTimer}
				onChange={timer => onSettingChange({ selectedTimer: timer })}
			/>

			<div className="text-gray-400 text-xs italic">Move cursor away to close</div>
		</div>
	)
}

function CheckboxSetting({
	label,
	checked,
	onChange,
}: {
	label: string
	checked: boolean
	onChange: (checked: boolean) => void
}) {
	return (
		<div className="mb-4">
			<label className="flex items-center text-black text-sm cursor-pointer">
				<input
					type="checkbox"
					checked={checked}
					onChange={e => onChange(e.target.checked)}
					className="mr-3 w-4 h-4"
				/>
				<span>{label}</span>
			</label>
		</div>
	)
}

function TextSetting({
	label,
	value,
	onChange,
	placeholder,
}: {
	label: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
}) {
	return (
		<div className="mb-4">
			<label className="block text-black text-sm font-medium mb-2">{label}</label>
			<input
				type="text"
				value={value}
				onChange={e => onChange(e.target.value)}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				placeholder={placeholder}
			/>
		</div>
	)
}

function TextShadowSettings({
	textShadow,
	onChange,
}: {
	textShadow: TextShadow
	onChange: (updates: Partial<TextShadow>) => void
}) {
	return (
		<div className="mb-4">
			<label className="flex items-center text-black text-sm cursor-pointer mb-3">
				<input
					type="checkbox"
					checked={textShadow.enabled}
					onChange={e => onChange({ enabled: e.target.checked })}
					className="mr-3 w-4 h-4"
				/>
				<span>Text Shadow</span>
			</label>

			{textShadow.enabled && (
				<div className="space-y-3 ml-7">
					<ColorPicker
						label="Shadow Color"
						value={textShadow.color}
						onChange={color => onChange({ color })}
					/>

					<RangeSlider
						label="Offset X"
						value={textShadow.offsetX}
						onChange={offsetX => onChange({ offsetX })}
						min={-20}
						max={20}
						unit="px"
					/>

					<RangeSlider
						label="Offset Y"
						value={textShadow.offsetY}
						onChange={offsetY => onChange({ offsetY })}
						min={-20}
						max={20}
						unit="px"
					/>

					<RangeSlider
						label="Blur Radius"
						value={textShadow.blurRadius}
						onChange={blurRadius => onChange({ blurRadius })}
						min={0}
						max={20}
						unit="px"
					/>
				</div>
			)}
		</div>
	)
}

// Predefined color palette for the custom color picker
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

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
	const [isOpen, setIsOpen] = useState(false)

	const handleColorSelect = (color: string) => {
		onChange(color)
		setIsOpen(false)
	}

	return (
		<div>
			<label className="block text-black text-xs font-medium mb-1">{label}</label>
			<div className="relative">
				{/* Color preview button */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="w-full h-8 border border-gray-300 rounded flex items-center px-2 gap-2 hover:border-gray-400 transition-colors"
					type="button"
				>
					<div className="w-6 h-6 rounded border border-gray-200" style={{ backgroundColor: value }} />
					<span className="text-xs text-gray-600 font-mono">{value.toUpperCase()}</span>
				</button>

				{/* Custom color palette popup */}
				{isOpen && (
					<div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-3 z-50 w-48">
						<div className="grid grid-cols-4 gap-2">
							{COLOR_PALETTE.map(color => (
								<button
									key={color}
									onClick={() => handleColorSelect(color)}
									className={`w-8 h-8 rounded border-2 transition-all ${value === color
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

function RangeSlider({
	label,
	value,
	onChange,
	min,
	max,
	unit,
}: {
	label: string
	value: number
	onChange: (value: number) => void
	min: number
	max: number
	unit: string
}) {
	return (
		<div>
			<label className="block text-black text-xs font-medium mb-1">
				{label}: {value}
				{unit}
			</label>
			<input
				type="range"
				min={min}
				max={max}
				value={value}
				onChange={e => onChange(Number(e.target.value))}
				className="w-full"
			/>
		</div>
	)
}

function TimerSelector({
	selectedTimer,
	onChange,
}: {
	selectedTimer: TimerName
	onChange: (timer: TimerName) => void
}) {
	const [isOpen, setIsOpen] = useState(false)

	const handleSelect = (timer: TimerName) => {
		onChange(timer)
		setIsOpen(false)
	}

	return (
		<div className="mb-4">
			<label className="block text-black text-sm font-medium mb-2">Timer Selection</label>
			<div className="relative">
				{/* Custom dropdown trigger */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center justify-between"
					type="button"
				>
					<span>{TIMER_LABELS[selectedTimer]}</span>
					<svg
						className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				{/* Custom dropdown menu */}
				{isOpen && (
					<div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
						{TIMER_NAMES.map(name => (
							<button
								key={name}
								onClick={() => handleSelect(name)}
								className={`w-full px-3 py-2 text-left text-sm transition-colors ${selectedTimer === name
									? 'bg-blue-100 text-blue-700'
									: 'text-gray-700 hover:bg-gray-100'
									}`}
								type="button"
							>
								{TIMER_LABELS[name]}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
