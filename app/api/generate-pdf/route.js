import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { name, job, computerNo, days, department } = await req.json();

    const pdfPath = path.join(process.cwd(), 'public', 'eid-template.pdf');

    if (!fs.existsSync(pdfPath)) {
      throw new Error(`Template not found at: ${pdfPath}`);
    }

    const existingPdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const safeName = String(name || '').slice(0, 28);
    const safeJob = String(job || '').slice(0, 18);
    const safeComputerNo = String(computerNo || '').slice(0, 14);
    const safeDays = String(days || '').slice(0, 5);
    const safeDepartment = String(department || '').slice(0, 24);

    const tableX = 50;
    const tableY = 600;
    const tableWidth = 500;
    const tableHeight = 50;
    const headerHeight = 20;
    const rowHeight = tableHeight - headerHeight;

    const daysW = 100;
    const computerW = 110;
    const jobW = 110;
    const nameW = tableWidth - daysW - computerW - jobW;

    const x1 = tableX + daysW;
    const x2 = x1 + computerW;
    const x3 = x2 + jobW;
    const headerBottomY = tableY + rowHeight;

    page.drawRectangle({
      x: tableX - 3,
      y: tableY - 3,
      width: tableWidth + 6,
      height: tableHeight + 6,
      color: rgb(1, 1, 1),
    });

    page.drawRectangle({
      x: tableX,
      y: headerBottomY,
      width: tableWidth,
      height: headerHeight,
      color: rgb(0.93, 0.93, 0.93),
    });

    page.drawRectangle({
      x: tableX,
      y: tableY,
      width: tableWidth,
      height: tableHeight,
      borderWidth: 1.2,
      borderColor: rgb(0, 0, 0),
    });

    [x1, x2, x3].forEach((x) => {
      page.drawLine({
        start: { x, y: tableY },
        end: { x, y: tableY + tableHeight },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    });

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

    function drawCenteredText(text, x, y, width, height, usedFont, size = 9) {
      const fitted = fitText(text, usedFont, size, width - 10);
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

    drawCenteredText('Days', tableX, headerBottomY, daysW, headerHeight, boldFont);
    drawCenteredText('Computer No', x1, headerBottomY, computerW, headerHeight, boldFont);
    drawCenteredText('Job', x2, headerBottomY, jobW, headerHeight, boldFont);
    drawCenteredText('Name', x3, headerBottomY, nameW, headerHeight, boldFont);

    drawCenteredText(safeDays, tableX, tableY, daysW, rowHeight, font);
    drawCenteredText(safeComputerNo, x1, tableY, computerW, rowHeight, font);
    drawCenteredText(safeJob, x2, tableY, jobW, rowHeight, font);
    drawCenteredText(safeName, x3, tableY, nameW, rowHeight, font);

    page.drawText(safeDepartment, {
      x: 455,
      y: 505,
      size: 12,
      font,
      color: rgb(0, 0, 0),
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
    console.error(error);
    return new Response(`PDF generation failed: ${error.message}`, {
      status: 500,
    });
  }
}
