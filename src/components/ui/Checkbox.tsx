interface CheckboxProps {
	label: string
	checked: boolean
	onChange: (checked: boolean) => void
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
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
