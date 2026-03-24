import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { name, job, computerNo, days } = await req.json();

    // Load template PDF
    const pdfPath = path.join(process.cwd(), 'public', 'eid-template.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];

    // Use standard font (for English)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Prevent overflow for long names
    const safeName = (name || '').slice(0, 25);

    // Draw values (aligned to your form)
    page.drawText(safeName, {
      x: 430,
      y: 610,
      size: 10,
      font,
    });

    page.drawText(job || '', {
      x: 310,
      y: 610,
      size: 10,
      font,
    });

    page.drawText(computerNo || '', {
      x: 205,
      y: 610,
      size: 10,
      font,
    });

    page.drawText(String(days || ''), {
      x: 115,
      y: 610,
      size: 10,
      font,
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="eid-form.pdf"',
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(`PDF generation failed: ${error.message}`, {
      status: 500,
    });
  }
}
