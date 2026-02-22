import { useCallback, useEffect, useState } from 'react'
import { useWebSocketContext } from '../../components/WebSocketProvider'
import { DEFAULT_WEBSOCKET_PATH } from '../../constants'
import { useSetting } from '../../hooks/useSetting'
import type { EventData } from '../../types'
import { formatEventTime } from '../../utils/time'

import QRCode from 'react-qr-code'
import { cn } from '../../utils/cn'
import demoBGImg from './demo-bg.png'
import hackIconImg from './hack-icon.png'
import hackImg from './hack.png'
import noteImg from './note.png'
import slideIconImg from './slide-icon.png'
import slideImg from './slide.png'
import slidoIconImg from './slido-icon.png'

export default function Card() {
	// useClearSreachParams()
	const { setting } = useSetting({ bg: false })

	const [eventData, setEventData] = useState<EventData | null>(null)

	const handler = useCallback((event: string, data: unknown) => {
		if (event === 'eventNow') {
			setEventData(data as EventData)
			return true
		}
		return false
	}, [])

	const { registerHandler, unregisterHandler } = useWebSocketContext()

	useEffect(() => {
		registerHandler(DEFAULT_WEBSOCKET_PATH, handler, {
			ignoreOtherTags: true,
			ignoreUnhandledEvents: true,
		})

		return () => {
			unregisterHandler()
		}
	}, [handler, registerHandler, unregisterHandler])

	if (!eventData) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-white text-xl animate-pulse">Waiting for event data...</div>
			</div>
		)
	}

	// 定義金屬漸層樣式 (Rectangle 39342)
	const metalOverlayStyle = {
		background: `
      radial-gradient(80.04% 80.04% at 0% -8.66%, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%), 
      linear-gradient(67.35deg, #4D5455 14.56%, #9EA1A1 28.05%, #848B8A 48.99%, #535D5E 55.35%, #4B5355 79.7%, #757A7B 88.54%, #4D5455 97.84%)
    `,
		backgroundBlendMode: 'overlay, normal',
	}

	// TODO: font: Inter
	return (
		<>
			<div className="relative">
				{setting.bg && (
					<img
						src={demoBGImg}
						className="absolute inset-0 object-cover pointer-events-none"
						alt="Background"
					/>
				)}

				<div
					className={cn(
						'w-106 bg-transparent relative flex flex-col items-center h-[771px] font-inter',
						setting.bg && 'top-[50px] left-[90px] border border-black ',
					)}
				>
					{/* 頂部活動資訊卡 (Rectangle 39348) */}
					<div className="relative w-full min-h-[260px]">
						<div
							className="bg-[#FFAF38] rounded-[36px] overflow-hidden h-full"
							// style={{ boxShadow: '0px 0px 10px rgba(108, 65, 3, 0.6)' }}
						>
							{/* 金屬覆蓋層 (Rectangle 39342) */}
							<div
								className="absolute inset-0 border border-black rounded-[36px] opacity-35 pointer-events-none"
								style={metalOverlayStyle}
							/>

							{/* 資訊內容層 */}
							<div className="relative z-10 px-8 py-6 h-full flex flex-col justify-between text-left w-full">
								<div>
									<div className="flex justify-between items-center mb-2">
										<span className="text-[#5C3D0E] text-xl font-extrabold text-[24px]">
											{eventData.custom.type}
										</span>
										<span className="text-[#5C3D0E] text-xl font-extrabold text-[24px]">
											{formatEventTime(eventData.timeStart)} -{' '}
											{formatEventTime(eventData.timeEnd)}
										</span>
									</div>

									<h1 className="text-[#3C3A38] text-[32px] font-bold leading-tight break-all">
										{eventData.title}
									</h1>
								</div>

								<p className="text-[#E8E4DD] text-[28px] font-semibold">{eventData.custom.speaker}</p>
							</div>
						</div>
						<img src={noteImg} alt="Note" width={96} className="absolute right-[9px] bottom-[-124px]" />
					</div>

					<span className="grow" />

					{/* Slido 區塊 */}
					<div className="w-full flex flex-col items-start mb-[42px]">
						<img src={slidoIconImg} width={152} />

						<div className="text-white text-[36px] font-bold tracking-wide ">
							{/* 若 eventData 有 slido 相關欄位請在此替換 */}
							{eventData.custom.slidoID}
						</div>
					</div>

					{/* 底部功能區塊 */}
					<div className="w-full grid grid-cols-2 gap-[18px]">
						{/* 簡報項目 */}
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2 ml-[18px]">
								<img src={slideIconImg} width={60} />
								<img src={slideImg} width={90} />
							</div>
							{/* 圖片區域留空，可依需求放入 img */}
							<div className="aspect-square bg-[#E4C496] backdrop-blur-md rounded-[36px] border-2 border-white/20 overflow-hidden grid place-items-center">
								{eventData.custom.slideURL && (
									<QRCode value={eventData.custom.slideURL} size={160} bgColor="transparent" />
								)}
							</div>
						</div>

						{/* 共筆項目 */}
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2 ml-[18px]">
								<img src={hackIconImg} width={60} />
								<img src={hackImg} width={90} />
							</div>

							<div className="aspect-square bg-[#E4C496] backdrop-blur-md rounded-[36px] border-2 border-white/20 overflow-hidden grid place-items-center">
								{eventData.custom.hackmdURL && (
									<QRCode value={eventData.custom.hackmdURL} size={160} bgColor="transparent" />
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
