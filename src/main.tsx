import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './style.css'
import Layout from './Layout'
import TimerDisplay from './TimerDisplay'
import AboutPage from './AboutPage'
import SettingsPage from './SettingsPage'
import DebugPage from './DebugPage'

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
