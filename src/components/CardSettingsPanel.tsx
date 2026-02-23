import type { CardSettings } from '../types'
import { Checkbox, TextInput } from './ui'

interface CardSettingsPanelProps {
	settings: CardSettings
	onSettingChange: (updates: Partial<CardSettings>) => void
}

export function CardSettingsPanel({ settings, onSettingChange }: CardSettingsPanelProps) {
	return (
		<div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-4 min-w-48">
			<h3 className="text-black font-semibold mb-4">Card Settings</h3>

			<Checkbox label="Show Background" checked={settings.bg} onChange={bg => onSettingChange({ bg })} />

			<TextInput
				label="WebSocket Path"
				value={settings.websocketPath}
				onChange={value => onSettingChange({ websocketPath: value })}
				placeholder="ws://localhost:4001/ws"
			/>

			<a href="/sitcon2026.json" className="text-blue-600 text-sm hover:underline mt-2 block">
				Ontime Config
			</a>

			<div className="text-gray-400 text-xs italic mt-2">Move cursor away to close</div>
		</div>
	)
}
