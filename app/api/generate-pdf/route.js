import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { name, job, computerNo, days } = await req.json();

    const pdfPath = path.join(process.cwd(), 'public', 'eid-template.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText(name || '', {
      x: 445,
      y: 612,
      size: 11,
      font,
    });

    page.drawText(job || '', {
      x: 330,
      y: 612,
      size: 11,
      font,
    });

    page.drawText(computerNo || '', {
      x: 228,
      y: 612,
      size: 11,
      font,
    });

    page.drawText(String(days || ''), {
      x: 128,
      y: 612,
      size: 11,
      font,
    });

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="eid-form.pdf"',
      },
    });
  } catch (error) {
    return new Response(`PDF generation failed: ${error.message}`, {
      status: 500,
    });
  }
}
