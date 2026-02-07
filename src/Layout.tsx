import { Outlet, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

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
	const [showMenu, setShowMenu] = useState(false)
	const location = useLocation()

	const currentPage = pages.find(page => page.path === location.pathname)

	return (
		<div className="w-screen h-screen bg-white flex items-center justify-center p-4 relative">
			{/* Page Content */}
			<div className="text-center w-full h-full flex items-center justify-center">
				<Outlet />
			</div>

			{/* Navigation Menu - Show on hover */}
			<div
				className="absolute top-4 left-4"
				onMouseEnter={() => setShowMenu(true)}
				onMouseLeave={() => setShowMenu(false)}
			>
				<div
					className={`transition-all duration-200 transform-gpu ${showMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
						}`}
				>
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
				</div>
			</div>

			{/* Current Page Indicator */}
			{currentPage && (
				<div className="absolute top-4 right-4 opacity-50 pointer-events-none">
					<div className="flex items-center space-x-2 text-black text-sm">
						<span className="text-lg">{currentPage.icon}</span>
						<span className="font-medium">{currentPage.name}</span>
					</div>
				</div>
			)}

		</div>
	)
}
