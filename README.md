# Timer Display

A timer display application that connects to a WebSocket source and shows real-time timer data.

## WebSocket Data Source

Connects to: `ws://localhost:4001/ws`

Receives data in format:

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

## Features

- ✅ Real-time timer display with milliseconds
- ✅ Automatic WebSocket connection with reconnection
- ✅ Connection status indicator
- ✅ Play/pause status display
- ✅ Additional timer metrics (duration, elapsed, added time, phase)
- ✅ Responsive design for mobile and desktop
- ✅ Dark theme with Tailwind CSS
- ✅ Error handling and manual reconnection

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
3. The timer will automatically connect to the WebSocket source
4. View the current timer time in large display
5. Additional metrics shown below the main timer

## Timer Display Format

- **Main Display**: MM:SS.cs (minutes:seconds:centiseconds)
- **Duration**: Total timer duration
- **Elapsed**: Time already elapsed
- **Added Time**: Any additional time added
- **Phase**: Current timer phase
- **Status**: Connected/Disconnected and Playing/Paused
