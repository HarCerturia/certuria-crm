import { SESSION_COOKIE, createAdminClient } from '../../utils/appwrite'
import { Account, Client } from 'node-appwrite'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  try {
    // Use admin client for user authentication
    const { account } = createAdminClient()

    // Create session - this will authenticate the user
    const session = await account.createEmailPasswordSession(email, password)

    // Set session cookie
    setCookie(event, SESSION_COOKIE, session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })

    // Create a session client to get user data
    const config = useRuntimeConfig()
    const sessionClient = new Client()
      .setEndpoint(config.public.awEndpoint)
      .setProject(config.public.awProject)
      .setSession(session.secret)

    const sessionAccount = new Account(sessionClient)
    const user = await sessionAccount.get()

    const userData = {
      $id: user.$id,
      name: user.name,
      email: user.email,
      emailVerification: user.emailVerification,
      prefs: user.prefs
    }

    return {
      success: true,
      data: {
        user: userData,
        sessionId: session.$id
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid credentials'
    throw createError({
      statusCode: 401,
      statusMessage: errorMessage
    })
  }
})
