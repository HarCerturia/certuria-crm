export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Get API key from environment variables
  const API_KEY = process.env.NUXT_DOCUSEAL_API_KEY as string
  const API_URL = process.env.NUXT_DOCUSEAL_API_URL as string

  if (!API_KEY) {
    throw createError({
      statusCode: 500,
      message: 'DocuSeal API key is not configured',
    })
  }

  if (!API_URL) {
    throw createError({
      statusCode: 500,
      message: 'DocuSeal API url is not configured',
    })
  }

  try {
    // Create template
    const { templateId, slug } = await createTemplate(API_KEY, API_URL, body)

    // Create submission
    const submissionId = await createSubmission(API_KEY, API_URL, templateId, slug, body)


    return {
      templateId,
      submissionId,
    }
  }
  catch (error: unknown) {
    console.error('DocuSeal API Error:', error)

    // Check if the error is already a formatted error with statusCode
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }

    // Handle error as an Error object if possible
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    // Otherwise create a generic error
    throw createError({
      statusCode: 500,
      message: errorMessage,
    })
  }
})

/**
 * Creates a DocuSeal template using base64 file data with embedded text tags
 */
async function createTemplate(apiKey: string, apiUrl: string, body: any): Promise<{ templateId: string, slug: string }> {
  const response = await fetch(`${apiUrl}/templates/pdf`, {
    method: 'POST',
    headers: getHeaders(apiKey),
    body: JSON.stringify({
      name: body.name,
      file: body.file,
    }),
  })

  const data = await handleResponse(response, 'Failed to upload template')

  return { templateId: data.id, slug: data.slug }
}

/**
 * Creates a DocuSeal submission
 * https://www.docuseal.com/guides/send-documents-for-signature-via-api
 */
async function createSubmission(apiKey: string, apiUrl: string, templateId: string, slug: string, body: any): Promise<string> {
  const submissionPayload = {
    template_id: templateId,
    order: 'preserved',
    // 1. send email to signer to sign,
    // 2. after signing send email to certuria customer service
    submitters: [
      {
        role: 'Signer',
        email: body.signerEmail // the one in the confirmation email input
      },
      {
        role: 'Service',
        email: body.serviceEmail, // certuria customer service contact person
      },
    ],
  }

  const response = await fetch(`${apiUrl}/submissions`, {
    method: 'POST',
    headers: getHeaders(apiKey),
    body: JSON.stringify(submissionPayload),
  })

  const data = await handleResponse(response, 'Failed to create submission')

  return data[0].submission_id
}

/**
 * Returns standard headers for DocuSeal API requests
 */
function getHeaders(apiKey: string): Record<string, string> {
  return {
    'X-Auth-Token': apiKey,
    'Content-Type': 'application/json',
  }
}

/**
 * Handles API response parsing and error handling
 */
async function handleResponse(response: Response, errorMessage: string): Promise<any> {
  let responseText = ''
  try {
    responseText = await response.text()
    const data = JSON.parse(responseText)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: data.error || errorMessage,
        data,
      })
    }

    return data
  }
  catch (error: unknown) {
    // If it's already a formatted error with statusCode, rethrow it
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error
    }

    console.error('Failed to parse response:', responseText)
    throw createError({
      statusCode: response.status || 500,
      message: errorMessage,
      data: { rawResponse: responseText },
    })
  }
}
