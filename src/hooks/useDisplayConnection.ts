import { useState, useEffect } from 'react'
import { Display } from 'controly'

interface UseDisplayConnectionResult {
	display: Display | null
	id: string
	showQRcode: boolean
}

export const useDisplayConnection = (): UseDisplayConnectionResult => {
	const [display, setDisplay] = useState<Display | null>(null)
	const [id, setID] = useState('')
	const [showQRcode, setShowQRcode] = useState(true)

	useEffect(() => {
		const displayInstance = new Display({
			serverUrl: 'wss://controly.1li.tw/ws',
			commandUrl: window.location + '/command.json',
		})

		displayInstance.on('subscribed', payload => {
			setShowQRcode(payload.count === 0)
		})
		displayInstance.on('unsubscribed', payload => {
			setShowQRcode(payload.count === 0)
		})
		displayInstance.on('open', setID)
		displayInstance.on('error', err => console.error('Display Error:', err))

		displayInstance.connect()
		setDisplay(displayInstance)

		return () => {
			display?.disconnect()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return { display, id, showQRcode }
}
