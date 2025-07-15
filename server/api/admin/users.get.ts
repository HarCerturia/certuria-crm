import { createAdminClient } from '~/domains/core/server/utils/appwrite'

export default defineEventHandler(async (event) => {
    // Get session cookie
    const sessionCookie = getCookie(event, 'aw-session')

    if (!sessionCookie) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const { users } = createAdminClient();
    return await users.list();

})
