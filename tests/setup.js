import { installGlobals } from "@remix-run/node";
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './mockApi';

// Remix polyfills
installGlobals();

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())