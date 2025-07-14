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

    // Get query parameters for cursor-based pagination and filtering
    const query = getQuery(event)
    const limit = parseInt(query.limit as string) || 20
    const cursor = query.cursor as string
    const direction = query.direction as string || 'after' // 'after' or 'before'
    const search = query.search as string
    const statusFilter = query.statusFilter as string

    // Build query array
    const queryArray = [
        Query.orderDesc('$createdAt'), // Use $createdAt for consistent ordering
        Query.limit(limit)
    ]

    // Add status filter
    if (statusFilter) {
        queryArray.push(Query.equal('proposalStatus', statusFilter))
    }

    // Add search filter (searching in bearerName field using fulltext index)
    if (search && search.trim()) {
        queryArray.push(Query.search('bearerName', search.trim()))
    }

    // Add cursor pagination
    if (cursor) {
        if (direction === 'before') {
            queryArray.push(Query.cursorBefore(cursor))
        } else {
            queryArray.push(Query.cursorAfter(cursor))
        }
    }

    const { documents, total } = await databases.listDocuments(
        config.public.awDatabaseSelfDisclosuresTz,
        config.public.awSelfDisclosuresCollectionTzCompletedSubmissions,
        queryArray
    )

    // Get status counts in parallel
    const statusCountsPromises = {
        total: Promise.resolve(total), // filtered total
        grandTotal: databases.listDocuments(
            config.public.awDatabaseSelfDisclosuresTz,
            config.public.awSelfDisclosuresCollectionTzCompletedSubmissions,
            [Query.limit(1)]
        ).then(result => result.total), // always all records
        pending: databases.listDocuments(
            config.public.awDatabaseSelfDisclosuresTz,
            config.public.awSelfDisclosuresCollectionTzCompletedSubmissions,
            [
                Query.equal('proposalStatus', 'pending'),
                Query.limit(1),
                ...(search ? [Query.search('bearerName', search.trim())] : [])
            ]
        ).then(result => result.total),
        approved: databases.listDocuments(
            config.public.awDatabaseSelfDisclosuresTz,
            config.public.awSelfDisclosuresCollectionTzCompletedSubmissions,
            [
                Query.equal('proposalStatus', 'approved'),
                Query.limit(1),
                ...(search ? [Query.search('bearerName', search.trim())] : [])
            ]
        ).then(result => result.total),
        rejected: databases.listDocuments(
            config.public.awDatabaseSelfDisclosuresTz,
            config.public.awSelfDisclosuresCollectionTzCompletedSubmissions,
            [
                Query.equal('proposalStatus', 'rejected'),
                Query.limit(1),
                ...(search ? [Query.search('bearerName', search.trim())] : [])
            ]
        ).then(result => result.total)
    }

    const statusCounts = await Promise.all([
        statusCountsPromises.total,
        statusCountsPromises.grandTotal,
        statusCountsPromises.pending,
        statusCountsPromises.approved,
        statusCountsPromises.rejected
    ]).then(([total, grandTotal, pending, approved, rejected]) => ({
        total,
        grandTotal,
        pending,
        approved,
        rejected
    }))

    // Determine if there are more pages
    const hasNext = documents.length === limit
    const hasPrev = !!cursor

    return {
        documents,
        pagination: {
            limit,
            total,
            hasNext,
            hasPrev,
            firstCursor: documents.length > 0 ? documents[0]?.$id : null,
            lastCursor: documents.length > 0 ? documents[documents.length - 1]?.$id : null
        },
        statusCounts
    }

})
