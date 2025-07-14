export interface LocationAddress {
  streetAndHouseNumber?: string
  postalCode?: string
  place?: string
}

export interface Location {
  locationAddress?: LocationAddress
  locationType?: string
  employees?: string | number
  departments?: string[]
  certDuration?: string | number
  monitDuration?: string | number
}

export interface AuditData {
  orderNumber?: string
  name: string
  legalForm?: string
  streetAndHouseNumber: string
  postalCode: string
  place: string
  salutation: string
  firstName: string
  lastName: string
  telephone: string
  email: string
  auditDuration: string | number
  locations?: Location[]
}

export interface ServiceData {
  number: string | number
  service: string
  quantity: string | number
  price: number
}

export interface PdfGenerationResult {
  success: boolean
  filename?: string
  pdfBlob?: Blob
  base64Data?: string
  error?: unknown
}