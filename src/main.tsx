import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import AboutPage from './pages/AboutPage'
import DebugPage from './pages/DebugPage'
import SettingsPage from './pages/SettingsPage'
import TimerDisplay from './pages/TimerDisplay'
import './style.css'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: [
			{
				index: true,
				element: <TimerDisplay />,
			},
			{
				path: 'about',
				element: <AboutPage />,
			},
			{
				path: 'settings',
				element: <SettingsPage />,
			},
			{
				path: 'debug',
				element: <DebugPage />,
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
