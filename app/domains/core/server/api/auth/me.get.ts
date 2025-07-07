import { createSessionClient, SESSION_COOKIE } from '../../utils/appwrite'

export default defineEventHandler(async (event) => {
  const { isAuthenticated, account } = createSessionClient(event)

  if (!isAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Not authenticated'
    })
  }

  try {
    const user = await account.get()

    return {
      success: true,
      data: {
        user: {
          $id: user.$id,
          name: user.name,
          email: user.email,
          emailVerification: user.emailVerification,
          prefs: user.prefs
        }
      }
    }
  } catch {
    // Session is invalid, clear the cookie
    deleteCookie(event, SESSION_COOKIE)

    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid session'
    })
  }
})
