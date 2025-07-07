import { parseAndNormalizeDocumentData } from "~/domains/self-disclosures/utils/parseDocument"
import { validateAuth, findSubmissionById, getAppwriteClient } from "~/domains/self-disclosures/server/utils/submissions"

export default defineEventHandler(async (event) => {
    await validateAuth(event)
    
    const { id } = getRouterParams(event)
    const { databases, config } = getAppwriteClient(event)
    
    const document = await findSubmissionById(id as string, databases, config)

    return {
        documentId: document.$id,
        createdAt: document.$createdAt,
        updatedAt: document.$updatedAt,
        submissionId: document.dsSubmissionId,
        ...parseAndNormalizeDocumentData(document.data)
    }
})