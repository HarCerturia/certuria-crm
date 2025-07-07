import { verifySession } from '../../../server/utils/appwrite'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { sessionId } = body

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Session ID is required'
    })
  }

  const result = await verifySession(sessionId)

    if (!result.valid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid session'
    })
  }

  return {
    user: result.user,
    valid: true
  }
})
