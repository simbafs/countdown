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

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
	return (
		<div>
			<label className="block text-black text-xs font-medium mb-1">{label}</label>
			<input
				type="color"
				value={value}
				onChange={e => onChange(e.target.value)}
				className="w-full h-8 border border-gray-300 rounded cursor-pointer"
			/>
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
	return (
		<div className="mb-4">
			<label className="block text-black text-sm font-medium mb-2">Timer Selection</label>
			<select
				value={selectedTimer}
				onChange={e => onChange(e.target.value as TimerName)}
				className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				{TIMER_NAMES.map(name => (
					<option key={name} value={name}>
						{TIMER_LABELS[name]}
					</option>
				))}
			</select>
		</div>
	)
}
