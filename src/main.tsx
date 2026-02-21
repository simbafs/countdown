import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import Layout from './components/Layout'
import WebSocketProvider from './components/WebSocketProvider'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<WebSocketProvider>
			<HashRouter>
				<Layout />
			</HashRouter>
		</WebSocketProvider>
	</React.StrictMode>,
)
