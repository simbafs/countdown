import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AboutPage from './AboutPage'
import DebugPage from './DebugPage'
import Layout from './Layout'
import SettingsPage from './SettingsPage'
import './style.css'
import TimerDisplay from './TimerDisplay'

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
