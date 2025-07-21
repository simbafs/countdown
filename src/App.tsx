import Countdown from './Countdown'
import { useDisplayConnection } from './hooks/useDisplayConnection'
import { QRCode } from './components/QRcode'

export default function App() {
	const { display, id, showQRcode } = useDisplayConnection()

	if (!display) {
		return <div>Connecting......</div>
	} else if (!id) {
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
