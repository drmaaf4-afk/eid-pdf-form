import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const { name, job, computerNo, days } = await req.json();

  const pdfPath = path.join(process.cwd(), 'public', 'eid-template.pdf');
  const existingPdfBytes = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText(name || '', { x: 420, y: 627, size: 10, font });
  page.drawText(job || '', { x: 315, y: 627, size: 10, font });
  page.drawText(computerNo || '', { x: 220, y: 627, size: 10, font });
  page.drawText(days || '', { x: 120, y: 627, size: 10, font });

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="eid-form.pdf"',
    },
  });
}
