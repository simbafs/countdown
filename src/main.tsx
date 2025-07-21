// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
	<div className="flex h-screen w-screen flex-col items-center justify-center">
		<App />
	</div>,
	// <StrictMode>
	// </StrictMode>,
)
