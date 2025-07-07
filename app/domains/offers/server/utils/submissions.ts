import { createSessionClient } from '~/domains/core/server/utils/appwrite'
import { Query } from 'node-appwrite'

export async function validateAuth(event: any) {
    const sessionCookie = getCookie(event, 'aw-session')

    if (!sessionCookie) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    return sessionCookie
}

export async function findSubmissionById(id: string, databases: any, config: any) {
    const { documents } = await databases.listDocuments(
        config.public.awDatabaseSelfDisclosures,
        config.public.awSelfDisclosuresCollectionAllSubmissions,
        [
            Query.equal("dsSubmissionId", parseInt(id))
        ]
    )

    if (!documents[0]) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Submission not found'
        })
    }

    return documents[0]
}

export function getAppwriteClient(event: any) {
    const config = useRuntimeConfig(event)
    const { databases } = createSessionClient(event)

    return { databases, config }
}
