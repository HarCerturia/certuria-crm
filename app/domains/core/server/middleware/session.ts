export default defineEventHandler(async (event) => {
  // Only handle page requests, not API calls
  if (event.node.req.url?.startsWith('/api/') ||
      event.node.req.url?.startsWith('/_nuxt/') ||
      event.node.req.url?.includes('.')) {
    return
  }

  const { SESSION_COOKIE } = await import('../utils/appwrite')
  const sessionId = getCookie(event, SESSION_COOKIE)

  if (sessionId) {
    try {
      const { verifySession } = await import('../utils/appwrite')
      const result = await verifySession(sessionId)

        if (result.valid && result.user) {
        // Store user data in event context for SSR
        event.context.user = result.user
        event.context.isAuthenticated = true
      } else {
        // Clear invalid session
        deleteCookie(event, SESSION_COOKIE)
        event.context.isAuthenticated = false
      }
    } catch {
      // Clear invalid session
      deleteCookie(event, 'session')
      event.context.isAuthenticated = false
    }
  } else {
    event.context.isAuthenticated = false
  }
})
