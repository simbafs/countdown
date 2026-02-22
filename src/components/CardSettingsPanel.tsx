import type { CardSettings } from '../types'
import { Checkbox } from './ui'

interface CardSettingsPanelProps {
	settings: CardSettings
	onSettingChange: (updates: Partial<CardSettings>) => void
}

export function CardSettingsPanel({ settings, onSettingChange }: CardSettingsPanelProps) {
	return (
		<div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-4 min-w-48">
			<h3 className="text-black font-semibold mb-4">Card Settings</h3>

			<Checkbox label="Show Background" checked={settings.bg} onChange={bg => onSettingChange({ bg })} />

			<div className="text-gray-400 text-xs italic mt-2">Move cursor away to close</div>
		</div>
	)
}
