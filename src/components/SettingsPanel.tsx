import { TIMER_LABELS, TIMER_NAMES } from '../constants'
import type { TextShadow, TimerName, TimerSettings } from '../types'
import { Checkbox, ColorPicker, RangeSlider, Select, TextInput } from './ui'

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

	const timerOptions = TIMER_NAMES.map(name => ({
		value: name,
		label: TIMER_LABELS[name],
	}))

	return (
		<div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-6 min-w-64">
			<h3 className="text-black font-semibold mb-4">Settings</h3>

			<Checkbox
				label="Show Hours"
				checked={settings.showHours}
				onChange={checked => onSettingChange({ showHours: checked })}
			/>

			<TextInput
				label="WebSocket Path"
				value={settings.websocketPath}
				onChange={value => onSettingChange({ websocketPath: value })}
				placeholder="ws://localhost:4001/ws"
			/>

			<TextShadowSettings textShadow={settings.textShadow} onChange={handleTextShadowChange} />

			<Select
				label="Timer Selection"
				value={settings.selectedTimer}
				options={timerOptions}
				onChange={timer => onSettingChange({ selectedTimer: timer as TimerName })}
			/>

			<div className="text-gray-400 text-xs italic">Move cursor away to close</div>
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
			<Checkbox label="Text Shadow" checked={textShadow.enabled} onChange={enabled => onChange({ enabled })} />

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
