import { useEffect, useRef, useState } from 'react'

interface Message {
	type: 'sent' | 'received'
	content: string
	timestamp: Date
}

export default function WebSocketTest() {
	const [wsUrl, setWsUrl] = useState('ws://localhost:8080')
	const [messages, setMessages] = useState<Message[]>([])
	const [inputMessage, setInputMessage] = useState('')
	const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>(
		'disconnected',
	)
	const wsRef = useRef<WebSocket | null>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const connect = () => {
		if (wsRef.current) {
			wsRef.current.close()
		}

		setConnectionStatus('connecting')

		try {
			const ws = new WebSocket(wsUrl)
			wsRef.current = ws

			ws.onopen = () => {
				setConnectionStatus('connected')
				setMessages(prev => [
					...prev,
					{
						type: 'received',
						content: 'Connected to WebSocket server',
						timestamp: new Date(),
					},
				])
			}

			ws.onmessage = event => {
				setMessages(prev => [
					...prev,
					{
						type: 'received',
						content: event.data,
						timestamp: new Date(),
					},
				])
			}

			ws.onerror = () => {
				setConnectionStatus('error')
				setMessages(prev => [
					...prev,
					{
						type: 'received',
						content: 'Connection error',
						timestamp: new Date(),
					},
				])
			}

			ws.onclose = () => {
				setConnectionStatus('disconnected')
				setMessages(prev => [
					...prev,
					{
						type: 'received',
						content: 'Disconnected from WebSocket server',
						timestamp: new Date(),
					},
				])
			}
		} catch (error) {
			setConnectionStatus('error')
			setMessages(prev => [
				...prev,
				{
					type: 'received',
					content: 'Failed to connect: Invalid URL',
					timestamp: new Date(),
				},
			])
		}
	}

	const disconnect = () => {
		if (wsRef.current) {
			wsRef.current.close()
			wsRef.current = null
		}
	}

	const sendMessage = () => {
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && inputMessage.trim()) {
			wsRef.current.send(inputMessage)
			setMessages(prev => [
				...prev,
				{
					type: 'sent',
					content: inputMessage,
					timestamp: new Date(),
				},
			])
			setInputMessage('')
		}
	}

	const clearMessages = () => {
		setMessages([])
	}

	const getStatusColor = () => {
		switch (connectionStatus) {
			case 'connected':
				return 'bg-green-500'
			case 'connecting':
				return 'bg-yellow-500'
			case 'error':
				return 'bg-red-500'
			default:
				return 'bg-gray-500'
		}
	}

	const getStatusText = () => {
		switch (connectionStatus) {
			case 'connected':
				return 'Connected'
			case 'connecting':
				return 'Connecting...'
			case 'error':
				return 'Error'
			default:
				return 'Disconnected'
		}
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white p-4">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8">WebSocket Test</h1>

				{/* Connection Controls */}
				<div className="bg-gray-800 rounded-lg p-6 mb-6">
					<div className="flex items-center gap-4 mb-4">
						<input
							type="text"
							value={wsUrl}
							onChange={e => setWsUrl(e.target.value)}
							placeholder="WebSocket URL (e.g., ws://localhost:8080)"
							className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
						/>
						<button
							onClick={connect}
							disabled={connectionStatus === 'connecting' || connectionStatus === 'connected'}
							className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors"
						>
							Connect
						</button>
						<button
							onClick={disconnect}
							disabled={connectionStatus === 'disconnected'}
							className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg transition-colors"
						>
							Disconnect
						</button>
					</div>

					<div className="flex items-center gap-2">
						<div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
						<span className="text-sm">{getStatusText()}</span>
					</div>
				</div>

				{/* Messages */}
				<div className="bg-gray-800 rounded-lg p-6 mb-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Messages</h2>
						<button
							onClick={clearMessages}
							className="px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
						>
							Clear
						</button>
					</div>

					<div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto mb-4">
						{messages.length === 0 ? (
							<p className="text-gray-500 text-center">
								No messages yet. Connect to a WebSocket server to start testing.
							</p>
						) : (
							<div className="space-y-2">
								{messages.map((message, index) => (
									<div
										key={index}
										className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
									>
										<div
											className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
												message.type === 'sent'
													? 'bg-blue-600 text-white'
													: 'bg-gray-700 text-gray-200'
											}`}
										>
											<p className="text-sm">{message.content}</p>
											<p className="text-xs opacity-70 mt-1">
												{message.timestamp.toLocaleTimeString()}
											</p>
										</div>
									</div>
								))}
								<div ref={messagesEndRef} />
							</div>
						)}
					</div>
				</div>

				{/* Message Input */}
				<div className="bg-gray-800 rounded-lg p-6">
					<div className="flex gap-4">
						<input
							type="text"
							value={inputMessage}
							onChange={e => setInputMessage(e.target.value)}
							onKeyPress={e => e.key === 'Enter' && sendMessage()}
							placeholder="Type a message to send..."
							disabled={connectionStatus !== 'connected'}
							className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
						/>
						<button
							onClick={sendMessage}
							disabled={connectionStatus !== 'connected' || !inputMessage.trim()}
							className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-colors disabled:cursor-not-allowed"
						>
							Send
						</button>
					</div>
				</div>

				{/* Instructions */}
				<div className="bg-gray-800 rounded-lg p-6 mt-6">
					<h3 className="text-lg font-semibold mb-2">How to use:</h3>
					<ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
						<li>Enter a WebSocket server URL (default: ws://localhost:8080)</li>
						<li>Click "Connect" to establish a connection</li>
						<li>Send messages using the input field</li>
						<li>Received messages will appear automatically</li>
						<li>Use "Disconnect" to close the connection</li>
					</ol>
					<p className="text-xs text-gray-400 mt-4">
						Note: You need a WebSocket server running to test the connection. You can use online WebSocket
						test servers or run your own local server.
					</p>
				</div>
			</div>
		</div>
	)
}
