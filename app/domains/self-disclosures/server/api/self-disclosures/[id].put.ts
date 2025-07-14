import { validateAuth, getAppwriteClient } from "~/domains/self-disclosures/server/utils/submissions"

export default defineEventHandler(async (event) => {
    await validateAuth(event)

    const { id } = getRouterParams(event) // document id from COMPLETED_SUBMISSION COLL
    const body = await readBody(event)

// Todo: databases von core global inkludieren ohne utils (möglich?)....
    //const config = useRuntimeConfig(event)
    //const { databases } = createSessionClient(event)

    // Todo: databases von core global inkludieren ohne utils (möglich?)....
    const { databases, config } = getAppwriteClient(event)

    await databases.updateDocument(config.public.awDatabaseSelfDisclosuresTz, config.public.awSelfDisclosuresCollectionTzCompletedSubmissions, id as string,
            {
                // isApproved true = [Enum] approved, otherwise rejected, default is pending (for unchecked proposals)
                proposalStatus: body.data.isApproved ? 'approved' : 'rejected',
                proposalStatusLog: JSON.stringify(body.data),
            });

    return {
        success: true,
    }
})
