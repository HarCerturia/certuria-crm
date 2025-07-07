import { SESSION_COOKIE, createSessionClient } from "../../utils/appwrite";

export default defineEventHandler(async (event) => {

  const sessionCookie = getCookie(event, SESSION_COOKIE);

  if (!sessionCookie) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No session found'
    })
  }

  try {

    const { account } = createSessionClient(event);

    // delete current session and cookie
    await account.deleteSession("current");

    // clear session cookie
    deleteCookie(event, SESSION_COOKIE);

    return {
      success: true
    }
  } catch (error: unknown) {
    console.log('Error deleting session:', error instanceof Error ? error.message : String(error));
    
    // Clear cookie even if API call failed
    deleteCookie(event, SESSION_COOKIE);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Session logout failed'
    })
  }

});
