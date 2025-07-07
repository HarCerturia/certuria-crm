import { createSessionClient } from '~/domains/core/server/utils/appwrite'
import { Query } from 'node-appwrite'

export default defineEventHandler(async (event) => {
    // Get session cookie
    const sessionCookie = getCookie(event, 'aw-session')

    if (!sessionCookie) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const config = useRuntimeConfig(event);
    const { databases } = createSessionClient(event);

    const { documents } = await databases.listDocuments(
        config.public.awDatabaseSelfDisclosures,
        config.public.awSelfDisclosuresCollectionCompletedSubmissions,
        [
            Query.orderDesc('submissionId')
        ]
    )

    return documents

})
