// Next.js 16 requires a default export from all page.tsx files at the same URL.
// The actual homepage is rendered by app/page.tsx (non-group takes precedence).
// This re-export satisfies the type constraint without creating a duplicate route.
export { default, metadata } from '../page'
