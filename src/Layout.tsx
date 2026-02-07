import { Link, Outlet, useLocation } from 'react-router-dom'
import HoverMenu from './HoverMenu'

interface Page {
	name: string
	path: string
	icon: string
}

const pages: Page[] = [
	{ name: 'Timer', path: '/', icon: '⏱️' },
	{ name: 'About', path: '/about', icon: 'ℹ️' },
	{ name: 'Settings', path: '/settings', icon: '⚙️' },
	{ name: 'Debug', path: '/debug', icon: '🔧' },
]

export default function Layout() {
	const location = useLocation()
	const currentPage = pages.find(page => page.path === location.pathname)

	return (
		<div className="w-screen h-screen bg-white flex items-center justify-center p-4 relative">
			{/* Page Content */}
			<div className="text-center w-full h-full flex items-center justify-center">
				<Outlet />
			</div>

			{/* Navigation Menu - Show on hover */}
			<HoverMenu position="top-left">
				<div className="bg-white border-2 border-gray-300 rounded-xl shadow-xl p-6 min-w-48">
					<h3 className="text-black font-semibold mb-4">Navigation</h3>
					<nav className="space-y-2">
						{pages.map(page => (
							<Link
								key={page.path}
								to={page.path}
								className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-sm ${location.pathname === page.path
										? 'bg-blue-100 text-blue-700'
										: 'text-gray-700 hover:bg-gray-100'
									}`}
							>
								<span className="text-lg">{page.icon}</span>
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
