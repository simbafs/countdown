interface TextInputProps {
	label: string
	value: string
	onChange: (value: string) => void
	placeholder?: string
}

export function TextInput({ label, value, onChange, placeholder }: TextInputProps) {
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
