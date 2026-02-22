# SITCON 2026 製播

A real-time display application for SITCON 2026 that connects to WebSocket sources and shows timer data and event information.

**AI-Generated Project**: This project was primarily developed using AI assistance with [opencode](https://opencode.ai/) - an interactive CLI tool for software engineering.

## WebSocket Data Source

Connects to: `ws://localhost:4001/ws`

**Backend**: This application connects to [OnTime](https://www.getontime.no/) - a professional scheduling and timer management system commonly used for live events, broadcasting, and conference management. OnTime provides real-time timer data and event information via WebSocket connections.

### Timer Data Format

```json
{
	"tag": "runtime-data",
	"payload": {
		"timer": {
			"addedTime": 0,
			"current": 2850989,
			"duration": 3000000,
			"elapsed": 149011,
			"expectedFinish": 75249294,
			"phase": "default",
			"playback": "play",
			"secondaryTimer": null,
			"startedAt": 72249294
		},
		"clock": 72398305
	}
}
```

### Event Data Format

```json
{
	"id": "60a5ee",
	"type": "event",
	"flag": false,
	"title": "透視 AI 抓內鬼：以注意力防範提示注入",
	"timeStart": 39900000,
	"timeEnd": 42300000,
	"duration": 2400000,
	"timeStrategy": "lock-end",
	"linkStart": true,
	"endAction": "none",
	"timerType": "count-down",
	"countToEnd": false,
	"skip": false,
	"note": "",
	"colour": "#FF7878",
	"delay": 0,
	"dayOffset": 0,
	"gap": 0,
	"cue": "1",
	"parent": "e0ad09",
	"revision": 0,
	"timeWarning": 120000,
	"timeDanger": 60000,
	"custom": {
		"speaker": "Harry"
	},
	"triggers": []
}
```

## Features

- ✅ Real-time timer display with dynamic text sizing
- ✅ Event card display with title, time range, and speaker
- ✅ Automatic WebSocket connection with reconnection
- ✅ Multiple timer support (main + 3 auxiliary timers)
- ✅ Customizable text shadows and styling
- ✅ URL-persisted settings
- ✅ Transparent background for overlay usage
- ✅ WebSocket debug interface
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety

## Setup with pnpm

### Install dependencies

```bash
pnpm install
```

### Start development server

```bash
pnpm run dev
```

### Build for production

```bash
pnpm run build
```

### Preview production build

```bash
pnpm run preview
```

## Usage

1. Start the application: `pnpm run dev`
2. Open http://localhost:5173 (or the port shown)
3. Navigate between pages:
    - **Timer** (`/`) - Main timer display with customizable settings
    - **Card** (`/card`) - Event information display
    - **WebSocket Debug** (`/debug`) - Debug interface for WebSocket events

## Pages

### Timer Display (`/`)

- Real-time timer display with dynamic text sizing
- Support for main and auxiliary timers
- Customizable text shadows and display options
- Settings accessible via hover menu

### Event Card (`/card`)

- Displays event information from `eventNext` WebSocket events
- Shows title, time range (hh:mm - hh:mm), and speaker
- Left-aligned layout with gradient styling

### WebSocket Debug (`/debug`)

- Real-time WebSocket event monitoring
- Event and tag filtering
- Export functionality for debugging

## Timer Display Format

- **Main Display**: MM:SS or HH:MM:SS (configurable)
- **Support**: Negative time formatting
- **Dynamic Sizing**: Automatically adjusts to container size
- **Custom Styling**: Text shadows and colors configurable

# TODO

- 子母畫面的框切換
- 缺 slide 或是 hackmd 的時候要放什麼
