interface RangeSliderProps {
	label: string
	value: number
	onChange: (value: number) => void
	min: number
	max: number
	unit: string
}

export function RangeSlider({ label, value, onChange, min, max, unit }: RangeSliderProps) {
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
