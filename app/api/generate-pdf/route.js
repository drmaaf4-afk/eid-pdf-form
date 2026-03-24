import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { name, job, computerNo, days } = await req.json();

    // Load template
    const pdfPath = path.join(process.cwd(), 'public', 'eid-template.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];

    // Load Arabic font (supports everything)
    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Amiri-Regular.ttf');
    const fontBytes = fs.readFileSync(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    // Helper for right-aligned Arabic text
    function drawRightText(text, xRight, y, size = 12) {
      const safeText = String(text || '');
      const textWidth = font.widthOfTextAtSize(safeText, size);

      page.drawText(safeText, {
        x: xRight - textWidth,
        y,
        size,
        font,
      });
    }

    // === Adjust positions here (fine tuning) ===
    drawRightText(name, 560, 610);        // الاسم
    drawRightText(job, 430, 610);         // الوظيفة
    drawRightText(computerNo, 300, 610);  // رقم الكمبيوتر
    drawRightText(days, 170, 610);        // عدد الأيام

    const finalPdf = await pdfDoc.save();

    return new Response(finalPdf, {
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
