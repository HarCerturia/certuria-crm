import { Account, ID, Client } from 'node-appwrite'
import { SESSION_COOKIE, createAdminClient } from '../../utils/appwrite'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, name } = body
  
  if (!email || !password || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, password, and name are required'
    })
  }
  
  try {
    // Use admin client for user creation
    const { account } = createAdminClient()
    
    // Create user account
    await account.create(ID.unique(), email, password, name)
    
    // Create session
    const session = await account.createEmailPasswordSession(email, password)
    
    // Create a session client to get user data
    const config = useRuntimeConfig()
    const sessionClient = new Client()
      .setEndpoint(config.public.awEndpoint)
      .setProject(config.public.awProject)
      .setSession(session.secret)
    
    const sessionAccount = new Account(sessionClient)
    const user = await sessionAccount.get()
    
    // Set session cookie
    setCookie(event, SESSION_COOKIE, session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
    
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed'
    throw createError({
      statusCode: 400,
      statusMessage: errorMessage
    })
  }
})