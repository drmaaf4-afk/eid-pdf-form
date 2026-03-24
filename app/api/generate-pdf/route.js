import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
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
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Safe text lengths
    const safeName = String(name || '').slice(0, 28);
    const safeJob = String(job || '').slice(0, 18);
    const safeComputerNo = String(computerNo || '').slice(0, 14);
    const safeDays = String(days || '').slice(0, 5);

    // Table placement on the original PDF
    const tableX = 82;
    const tableY = 585;
    const tableWidth = 503;
    const tableHeight = 70;
    const headerHeight = 34;
    const rowHeight = tableHeight - headerHeight;

    // Column widths
    const daysW = 90;
    const computerW = 120;
    const jobW = 120;
    const nameW = tableWidth - daysW - computerW - jobW;

    const x1 = tableX + daysW;
    const x2 = x1 + computerW;
    const x3 = x2 + jobW;
    const headerBottomY = tableY + rowHeight;

    // Cover old table row
    page.drawRectangle({
      x: tableX - 2,
      y: tableY - 2,
      width: tableWidth + 4,
      height: tableHeight + 4,
      color: rgb(1, 1, 1),
    });

    // Header background
    page.drawRectangle({
      x: tableX,
      y: headerBottomY,
      width: tableWidth,
      height: headerHeight,
      color: rgb(0.93, 0.93, 0.93),
    });

    // Outer border
    page.drawRectangle({
      x: tableX,
      y: tableY,
      width: tableWidth,
      height: tableHeight,
      borderWidth: 1.2,
      borderColor: rgb(0, 0, 0),
    });

    // Column lines
    page.drawLine({
      start: { x: x1, y: tableY },
      end: { x: x1, y: tableY + tableHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x2, y: tableY },
      end: { x: x2, y: tableY + tableHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    page.drawLine({
      start: { x: x3, y: tableY },
      end: { x: x3, y: tableY + tableHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Header/value divider
    page.drawLine({
      start: { x: tableX, y: headerBottomY },
      end: { x: tableX + tableWidth, y: headerBottomY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    function fitText(text, usedFont, size, maxWidth) {
      let t = String(text || '');
      while (t.length > 0 && usedFont.widthOfTextAtSize(t, size) > maxWidth) {
        t = t.slice(0, -1);
      }
      return t;
    }

    function drawCenteredText(text, x, y, width, height, usedFont, size = 10, padding = 6) {
      const fitted = fitText(text, usedFont, size, width - padding * 2);
      const textWidth = usedFont.widthOfTextAtSize(fitted, size);
      const textX = x + (width - textWidth) / 2;
      const textY = y + (height - size) / 2 + 2;

      page.drawText(fitted, {
        x: textX,
        y: textY,
        size,
        font: usedFont,
        color: rgb(0, 0, 0),
      });
    }

    // English headers
    drawCenteredText('Days', tableX, headerBottomY, daysW, headerHeight, boldFont, 10);
    drawCenteredText('Computer No', x1, headerBottomY, computerW, headerHeight, boldFont, 10);
    drawCenteredText('Job', x2, headerBottomY, jobW, headerHeight, boldFont, 10);
    drawCenteredText('Name', x3, headerBottomY, nameW, headerHeight, boldFont, 10);

    // Values
    drawCenteredText(safeDays, tableX, tableY, daysW, rowHeight, font, 10);
    drawCenteredText(safeComputerNo, x1, tableY, computerW, rowHeight, font, 10);
    drawCenteredText(safeJob, x2, tableY, jobW, rowHeight, font, 10);
    drawCenteredText(safeName, x3, tableY, nameW, rowHeight, font, 10);

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
