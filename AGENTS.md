# AGENTS.md

This document contains development guidelines and commands for agentic coding agents working in this repository.

## Build Commands

### Development

- `pnpm run dev` - Start development server (Vite)
- `pnpm run build` - Build for production (runs TypeScript compile then Vite build)
- `pnpm run preview` - Preview production build locally
- `pnpm run format` - Format code with Prettier

### TypeScript

- `tsc` - Run TypeScript compiler check (no output, type checking only)
- `tsc --noEmit` - Same as above (tsconfig.json has `"noEmit": true`)

### Testing

This project currently has no test suite configured. Tests should be added using a framework like Vitest or Jest.

## Code Style Guidelines

### Formatting (Prettier)

- Print width: 120 characters
- Tab width: 4 spaces
- Use tabs (not spaces)
- No semicolons
- Single quotes for strings
- Avoid parentheses around arrow function parameters when possible
- Automatic import organization with `prettier-plugin-organize-imports`
- Tailwind CSS class sorting with `prettier-plugin-tailwindcss`

### TypeScript Configuration

- Strict mode enabled
- No unused locals or parameters allowed
- ES2022 target with DOM library
- React JSX transform
- Bundler module resolution
- `.tsx` and `.ts` file extensions allowed in imports

### Import Organization

- Use `prettier-plugin-organize-imports` - imports are automatically organized
- React imports should be: `import React from 'react'`
- Group imports by: external libraries → internal modules → types
- Use named exports for components: `export default function ComponentName()`

### Component Structure

- Use functional components with hooks
- TypeScript interfaces for component props and data structures
- Define interfaces at the top of files, before the component
- Use `useRef` for WebSocket instances and timers
- Use `useEffect` for lifecycle management and cleanup

### Naming Conventions

- Components: PascalCase with descriptive names
- Functions/variables: camelCase
- Interfaces: PascalCase with descriptive names (`TimerData`, `WebSocketData`)
- Constants: UPPER_SNAKE_CASE if exported, camelCase if local
- File names: PascalCase for components (`.tsx`), camelCase for utilities (`.ts`)

### Error Handling

- Use try-catch blocks for WebSocket operations and JSON parsing
- Log errors with `console.error()` including context
- Implement graceful fallbacks for missing data
- Handle WebSocket connection states properly

### WebSocket Implementation

- Use refs (`useRef`) for WebSocket instances to persist across renders
- Implement automatic reconnection with timeout delays
- Cleanup connections in useEffect return functions
- Handle all WebSocket events: `onopen`, `onmessage`, `onerror`, `onclose`
- Type-safe JSON parsing with interface validation

### React Patterns

- Use `useState` for local state management
- Use `useEffect` for side effects and subscriptions
- Implement proper cleanup in useEffect returns
- Use conditional rendering for loading/error states
- Event handlers should be inline functions with proper typing

### Styling with Tailwind CSS

- Use utility classes for all styling
- Responsive design with `min-w-`, `max-w-`, responsive prefixes
- Use semantic color classes (bg-gray-800, text-white, etc.)
- Implement smooth transitions and transforms for UI animations
- Use `tabular-nums` for timer displays to prevent digit jumping

### State Management

- Local component state with `useState` for UI state
- URL query parameters for persistent settings
- Use `URLSearchParams` and `window.history` for URL state sync
- Keep state updates atomic and predictable

### Performance

- Use `useRef` for values that don't trigger re-renders
- Implement debouncing/throttling for frequent updates if needed
- Use `transform-gpu` for animations to leverage hardware acceleration
- Avoid unnecessary re-renders with proper dependency arrays

### File Organization

```
src/
├── main.tsx          # Application entry point
├── style.css         # Global styles and Tailwind imports
├── TimerDisplay.tsx  # Main timer component
└── WebSocketTest.tsx # WebSocket testing utility
```

## Development Workflow

1. Run `pnpm run dev` to start development
2. Make changes following the style guidelines
3. Run `pnpm run format` before committing
4. Run `pnpm run build` to verify production build works
5. Test WebSocket connectivity with the configured endpoint

## Project-Specific Notes

- Main application connects to `ws://localhost:4001/ws`
- Timer data format: `{tag, payload: {timer: TimerData, clock: number}}`
- Settings are persisted in URL query parameters
- No external API dependencies besides the WebSocket connection
- Transparent background for overlay/overlay-style display usage
