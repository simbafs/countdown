import React from 'react'
import ReactDOM from 'react-dom/client'
import './style.css'
import TimerDisplay from './TimerDisplay'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<TimerDisplay />
	</React.StrictMode>,
)
