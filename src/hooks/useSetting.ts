import { getProperty, setProperty } from 'dot-prop'
import { useCallback, useEffect, useRef, useState } from 'react'

type PlainObject = Record<string, unknown>

function getAllPaths(obj: PlainObject, prefix = ''): string[] {
	const paths: string[] = []

	for (const key of Object.keys(obj)) {
		const newPath = prefix ? `${prefix}.${key}` : key
		const value = obj[key]

		if (isPlainObject(value)) {
			paths.push(...getAllPaths(value as PlainObject, newPath))
		} else {
			paths.push(newPath)
		}
	}

	return paths
}

function isPlainObject(value: unknown): value is PlainObject {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function serializeValue(value: unknown): string {
	return JSON.stringify(value)
}

function deserializeValue(value: string): unknown {
	try {
		return JSON.parse(value)
	} catch {
		return value
	}
}

interface UseSettingReturn<T> {
	setting: T
	setSetting: (updates: Partial<T>) => void
	resetToDefaults: () => void
	isLoaded: boolean
}

export function useSetting<T extends PlainObject>(defaultValue: T): UseSettingReturn<T> {
	const [setting, setSettingState] = useState<T>(defaultValue)
	const [isLoaded, setIsLoaded] = useState(false)
	const defaultValueRef = useRef(defaultValue)

	// Load settings from URL on mount
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search)
		const defaultPaths = getAllPaths(defaultValueRef.current)
		const loadedSettings: Partial<T> = {}
		let hasChanges = false

		for (const path of defaultPaths) {
			const value = urlParams.get(path)
			if (value !== null) {
				const deserialized = deserializeValue(value)
				Object.assign(loadedSettings, setProperty(loadedSettings, path, deserialized))
				hasChanges = true
			}
		}

		if (hasChanges) {
			setSettingState(prev => ({ ...prev, ...loadedSettings }))
		}
		setIsLoaded(true)
	}, [])

	// Save settings to URL whenever they change
	useEffect(() => {
		if (!isLoaded) return

		const url = new URL(window.location.href)
		const defaultPaths = getAllPaths(defaultValueRef.current)

		for (const path of defaultPaths) {
			const currentValue = getProperty(setting, path)
			const defaultValue = getProperty(defaultValueRef.current, path)

			if (JSON.stringify(currentValue) !== JSON.stringify(defaultValue)) {
				url.searchParams.set(path, serializeValue(currentValue))
			} else {
				url.searchParams.delete(path)
			}
		}

		window.history.replaceState({}, '', url.toString())
	}, [setting, isLoaded])

	const setSetting = useCallback((updates: Partial<T>) => {
		setSettingState(prev => {
			const result = { ...prev }

			for (const [key, value] of Object.entries(updates)) {
				if (key.includes('.')) {
					Object.assign(result, setProperty(result, key, value))
				} else {
					;(result as PlainObject)[key] = value
				}
			}

			return result
		})
	}, [])

	const resetToDefaults = useCallback(() => {
		setSettingState(defaultValueRef.current)
	}, [])

	return { setting, setSetting, resetToDefaults, isLoaded }
}

export function useClearSreachParams() {
	useEffect(() => {
		// Clear search parameters when entering card view
		const url = new URL(window.location.href)
		url.search = ''
		window.history.replaceState({}, '', url.toString())
	}, [])
}
