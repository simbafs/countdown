import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Card from '../pages/Card'
import Timer from '../pages/Timer'
import WebSocketDebugPage from '../pages/WebSocketDebugPage'
import HoverMenu from './HoverMenu'

interface Page {
	name: string
	path: string
	element: React.ReactNode
}

const pages: Page[] = [
	{ name: 'Timer', path: '/', element: <Timer /> },
	{ name: 'Card', path: '/card', element: <Card /> },
	{ name: 'WebSocket Debug', path: '/debug', element: <WebSocketDebugPage /> },
]

export default function Layout() {
	const location = useLocation()

	return (
		<div className="w-screen h-screen relative">
			{/* Page Content */}
			<Routes>
				{pages.map(page => (
					<Route key={page.path} path={page.path} element={page.element} />
				))}
			</Routes>

			{/* Navigation Menu - Show on hover */}
			<HoverMenu position="top-left">
				<div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-6 min-w-48">
					<h3 className="text-black font-semibold mb-4">Navigation</h3>
					<nav className="space-y-2">
						{pages.map(page => (
							<Link
								key={page.path}
								to={page.path}
								className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${
									location.pathname === page.path
										? 'bg-blue-100 text-blue-700'
										: 'text-gray-700 hover:bg-gray-100'
								}`}
							>
								<span>{page.name}</span>
							</Link>
						))}
					</nav>
					<div className="text-gray-400 text-xs italic mt-4">Move cursor away to close</div>
				</div>
			</HoverMenu>
		</div>
	)
}
