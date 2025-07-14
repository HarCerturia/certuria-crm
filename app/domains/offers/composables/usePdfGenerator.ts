import type { AuditData, ServiceData, PdfGenerationResult, Location } from '~/domains/offers/types/audit'

export const usePdfGenerator = () => {
  const generateAuditPdf = async (auditData: AuditData, servicesData: ServiceData[], openInBrowser: boolean = true): Promise<PdfGenerationResult> => {
    try {
      const { jsPDF } = await import('jspdf')
      const autoTable = (await import('jspdf-autotable')).default

      const doc = new jsPDF('p', 'mm', 'a4')
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 18

      // Company data
      const companyData = {
        name: 'Certuria Certification Germany GmbH',
        address: 'Merseburger Straße 73',
        city: '06112 Halle (Saale)',
        email: 'kontakt@certuria.de',
        phone: '+49 (0) 345 225 801-50',
        fax: '+49 (0) 345 225 801-59',
        hrb: 'HRB: 19469 Stendal',
        ustId: 'USt-ID: DE289855100',
        ceo: 'Geschäftsführer: Dominik Juric',
        bank: 'Saalesparkasse',
        bic: 'BIC: NOLADE21HAL',
        iban: 'IBAN: DE49800537621894030180'
      }

      const currentDate = new Date().toLocaleDateString('de-DE')
      const orderNumber = auditData?.orderNumber || 'AO-2025-001'

      // Header with logo
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(34, 49, 63)
      doc.text('Auditauftrag', margin, 22)

      // Logo
      let logoXPosition = pageWidth - margin - 45
      try {
        const logoUrl = '/logo-certuria.png'
        const aspectRatio = 2.5
        const targetHeight = 15
        const targetWidth = targetHeight * aspectRatio
        logoXPosition = pageWidth - margin - (targetWidth + 10)
        doc.addImage(logoUrl, 'PNG', logoXPosition, 16, targetWidth, targetHeight)
      } catch (error) {
        console.warn('Logo konnte nicht geladen werden:', error)
      }

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(120)
      doc.text(`Nr.: ${orderNumber} vom ${currentDate}`, margin, 30)

      // Company info
      let yPos = 40
      doc.setFontSize(9)
      doc.setTextColor(80)
      doc.setFont('helvetica', 'bold')
      doc.text(companyData.name, margin, yPos)
      doc.setFont('helvetica', 'normal')

      const companyInfo = [
        companyData.address,
        companyData.city,
        `E-Mail: ${companyData.email}`,
        `Tel.: ${companyData.phone}`
      ]
      companyInfo.forEach((info, i) => {
        doc.text(info, margin, yPos + 5 + (i * 5))
      })

      // Bank info
      const bankInfo = [companyData.hrb, companyData.ustId, companyData.ceo, companyData.bank, companyData.bic, companyData.iban]
      bankInfo.forEach((info, i) => {
        doc.text(info, logoXPosition, yPos + (i * 5))
      })

      yPos += 45

      // Customer data section
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(41, 128, 185)
      doc.text('Kundendaten', margin, yPos)
      yPos += 7
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(60)

      const customerInfo = [
        `Bezeichnung: ${auditData.name} ${auditData.legalForm}`,
        `Geschäftssitz: ${auditData.streetAndHouseNumber}, ${auditData.postalCode} ${auditData.place}`,
        `Kontakt: ${auditData.salutation} ${auditData.firstName} ${auditData.lastName}`,
        `Telefon: ${auditData.telephone}`,
        `E-Mail: ${auditData.email}`
      ]
      customerInfo.forEach((info, i) => {
        doc.text(info, margin, yPos + (i * 5))
      })

      yPos += customerInfo.length * 5 + 10

      // Description section
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.setTextColor(41, 128, 185)
      doc.text('Beschreibung', margin, yPos)
      yPos += 7
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(60)

      const descriptionInfo = [
        'Betreff: Erteilung der Trägerzulassung',
        `Auditdauer: ${auditData.auditDuration} Tagewerke`,
        'Standards: AZAV (Akkreditierungs- und Zulassungsverordnung Arbeitsförderung)',
        'Zahlweise: Rechnung'
      ]
      descriptionInfo.forEach((info, i) => {
        doc.text(info, margin, yPos + (i * 5))
      })

      yPos += descriptionInfo.length * 5 + 15

      // Locations table
      if (auditData?.locations && auditData.locations.length > 0) {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.setTextColor(41, 128, 185)
        doc.text('Standorte', margin, yPos)

        const locationTableData = auditData.locations.map((loc: Location) => [
          `${loc.locationAddress?.streetAndHouseNumber || ''}, ${loc.locationAddress?.postalCode || ''} ${loc.locationAddress?.place || ''}`,
          loc.locationType || '',
          loc.employees || '0',
          loc.departments?.join(', ') || '',
          `${loc.certDuration || '0'}`,
          `${loc.monitDuration || '0'}`
        ])

        autoTable(doc, {
          startY: yPos + 5,
          head: [['Standort', 'Typ', 'MA (VZÄ)', 'Fachbereiche', 'ZA (TW)', 'ÜA (TW)']],
          body: locationTableData,
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [70, 150, 210], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [232, 240, 254] },
          margin: { left: margin, right: margin },
          tableWidth: pageWidth - (margin * 2),
          columnStyles: {
            0: { cellWidth: 'auto' },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 'auto' },
            4: { cellWidth: 'auto', halign: 'center' },
            5: { cellWidth: 'auto', halign: 'center' }
          }
        })

        yPos = doc.lastAutoTable.finalY + 15
      }

      // New page check
      if (yPos > 200) {
        doc.addPage()
        yPos = 30
      }

      // Services table
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(41, 128, 185)
      doc.text('Ablauf & Leistungen', margin, yPos)

      const formatPrice = (price: number) => {
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR'
        }).format(price)
      }

      const servicesTableData = servicesData.map((s: ServiceData) => [
        s.number,
        s.service,
        s.quantity,
        formatPrice(s.price)
      ])

      autoTable(doc, {
        startY: yPos + 5,
        head: [['#', 'Titel & Beschreibung', 'Menge', 'Preis']],
        body: servicesTableData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 4 },
        headStyles: { fillColor: [70, 150, 210], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [232, 240, 254] },
        tableWidth: pageWidth - (margin * 2),
        columnStyles: {
          0: { cellWidth: 'auto', halign: 'center' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto', halign: 'center' },
          3: { cellWidth: 'auto', halign: 'right', textColor: [39, 174, 96], fontStyle: 'bold' }
        },
        margin: { left: margin, right: margin }
      })

      // Total
      const totalY = doc.lastAutoTable.finalY + 10
      const total = servicesData.reduce((sum, item) => sum + item.price, 0)
      const totalPrice = formatPrice(total)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(15)
      doc.setTextColor(39, 174, 96)
      doc.text(`Gesamtsumme: ${totalPrice}`, pageWidth - margin, totalY, { align: 'right' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(120)
      doc.text('zzgl. MwSt.', pageWidth - margin, totalY + 6, { align: 'right' })

      // Footer
      const footerY = totalY + 20
      doc.setFontSize(8)
      doc.setTextColor(100)
      doc.text('Zahlungsbedingungen: Zahlung binnen 14 Tagen nach Rechnungsstellung ohne Abzug.', margin, footerY)
      doc.text('Gültigkeitsdauer: Dieses Angebot ist 30 Tage gültig.', margin, footerY + 5)

      // Add signature section with DocuSeal text tags
      const signatureY = footerY + 20
      doc.setFontSize(10)
      doc.text('{{Sign;type=signature}}', margin, signatureY)
      doc.text('Unterschrift Kunde', margin, signatureY + 15)

      // Open PDF in browser (optional)
      const filename = `Auditauftrag_${orderNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${currentDate.replace(/[^0-9]/g, '')}.pdf`
      const pdfBlob = doc.output('blob')
      
      if (openInBrowser) {
        const pdfUrl = URL.createObjectURL(pdfBlob)
        window.open(pdfUrl, '_blank')
      }

      // Generate base64 for DocuSeal
      const base64String = doc.output('datauristring')
      const base64Data = base64String.split(',')[1] ?? ''

      return {
        success: true,
        filename,
        pdfBlob,
        base64Data
      }

    } catch (error) {
      console.error('Fehler beim Generieren des PDFs:', error)
      return { success: false, error }
    }
  }

  return { generateAuditPdf }
}
