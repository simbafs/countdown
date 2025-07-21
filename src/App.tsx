import { useEffect, useState } from 'react'
import Countdown from './Countdown'
import { Display } from 'controly'
import { QRCode } from './QRcode'

function ShowCountdown({ display }: { display: Display }) {
	const [showQRcode, setShorQRcode] = useState(true)
	const [id, setID] = useState('')

	useEffect(() => {
		display.on('subscribed', payload => {
			setShorQRcode(payload.count === 0)
		})
		display.on('unsubscribed', payload => {
			setShorQRcode(payload.count === 0)
		})
		display.on('open', setID)
		display.connect()
	}, [display])

	if (!id) {
		return <div>Waiting ID...</div>
	} else if (showQRcode) {
		return (
			<>
				<QRCode text={id} />
				<h1 className="text-3xl font-bold">{id}</h1>
			</>
		)
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
		display.on('error', err => console.error('Error:', err))
		setDisplay(display)
	}, [])

	useEffect(() => {
		if (!display) {
			console.log('display null')
			return
		}
	}, [display])

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center">
			{display != null ? <ShowCountdown display={display} /> : <div>Connecting......</div>}
		</div>
	)
}
