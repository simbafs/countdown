import { useEffect, useState } from 'react'
import Countdown from './Countdown'
import { Display } from 'controly'
import { QRCode } from './QRcode'

function ShowCountdown({ display }: { display: Display }) {
	const [showQRcode, setShorQRcode] = useState(true)

	useEffect(() => {
		display.on('subscribed', payload => {
			setShorQRcode(payload.count === 0)
		})
		display.on('unsubscribed', payload => {
			setShorQRcode(payload.count === 0)
		})
	}, [display])

	if (showQRcode) {
		return <QRCode text={display.getId() || ''} />
	} else {
		return <Countdown display={display} />
	}
}

export default function App() {
	const [display, setDisplay] = useState<Display | null>(null)

	useEffect(() => {
		const display = new Display({
			serverUrl: 'wss://controly.1li.tw/ws',
			commandUrl: window.location + '/command.json',
		})
		display.on('open', () => console.log('connected!'))
		display.on('error', err => console.error('Error:', err))
		display.connect()
		setDisplay(display)
	}, [])

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center">
			{display != null && display.getId() !== null ? (
				<ShowCountdown display={display} />
			) : (
				<div>Connecting......</div>
			)}
		</div>
	)
}
