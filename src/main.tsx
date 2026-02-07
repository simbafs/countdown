import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout, { pages } from './components/Layout'
import './style.css'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout />,
		children: pages
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
