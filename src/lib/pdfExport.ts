import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PdfItem {
  question: string;
  compliance: boolean | null;
  weight: number;
  score: number;
  comments: string;
  responsible_person: string;
}

interface PdfCategory {
  number: number;
  name: string;
  items: PdfItem[];
}

interface PdfExportOptions {
  templateName: string;
  categories: PdfCategory[];
  date?: string;
  auditorName?: string;
}

export const exportChecklistToPdf = (options: PdfExportOptions) => {
  const { templateName, categories, date, auditorName } = options;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 20;

  // === Header band ===
  doc.setFillColor(30, 58, 95); // dark navy
  doc.rect(0, 0, pageWidth, 36, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(templateName, margin, 16);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 210, 225);
  const reportDate = date || new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
  doc.text(`Date: ${reportDate}`, margin, 26);
  if (auditorName) {
    doc.text(`Auditor: ${auditorName}`, margin, 32);
  }

  // Score badge in header
  const totalScore = categories.reduce((s, c) => s + c.items.reduce((si, i) => si + i.score, 0), 0);
  const maxScore = categories.reduce((s, c) => s + c.items.reduce((si, i) => si + i.weight, 0), 0);
  const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  const scoreText = `${totalScore} / ${maxScore}  (${pct}%)`;
  const scoreW = doc.getTextWidth(scoreText);
  doc.text(scoreText, pageWidth - margin - scoreW, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 210, 225);
  const lbl = "TOTAL SCORE";
  doc.text(lbl, pageWidth - margin - doc.getTextWidth(lbl), 26);

  y = 44;

  // === Per-category tables ===
  categories.forEach((cat) => {
    const catScore = cat.items.reduce((s, i) => s + i.score, 0);
    const catMax = cat.items.reduce((s, i) => s + i.weight, 0);
    const pageHeight = doc.internal.pageSize.getHeight();

    // Estimate total height: category header (14mm) + table header row (~12mm) + rows (~10mm each)
    const estimatedHeight = 14 + 12 + cat.items.length * 10;
    const remainingSpace = pageHeight - y - 15; // 15mm bottom margin

    // If the entire section won't fit and we're not at the top of a page, start a new page
    if (estimatedHeight > remainingSpace && y > 30) {
      doc.addPage();
      y = 20;
    }

    // Category header
    doc.setFillColor(240, 243, 248);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 95);
    doc.text(`${cat.number}. ${cat.name}`, margin + 4, y + 7);

    const catScoreText = `${catScore} / ${catMax}`;
    doc.setFontSize(10);
    doc.setTextColor(80, 95, 120);
    doc.text(catScoreText, pageWidth - margin - 4 - doc.getTextWidth(catScoreText), y + 7);
    y += 14;

    // Table rows
    const tableBody = cat.items.map((item, idx) => {
      const complianceStr = item.compliance === null ? "—" : item.compliance ? "Yes" : "No";
      return [
        (idx + 1).toString(),
        item.question,
        complianceStr,
        item.weight.toString(),
        item.score.toString(),
        item.comments || "",
        item.responsible_person || "",
      ];
    });

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      rowPageBreak: "avoid",
      showHead: "everyPage",
      head: [["#", "Question", "Compliance\nYes / No", "Weight\nout of 100", "Score", "Comments / Remarks", "Responsible Person"]],
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: [30, 58, 95],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
        cellPadding: 3,
        valign: "middle",
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: [40, 40, 40],
        lineColor: [220, 225, 230],
        lineWidth: 0.3,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 253],
      },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: 20, halign: "center" },
        2: { cellWidth: 15, halign: "center" },
        3: { cellWidth: 15, halign: "center" },
        4: { cellWidth: 40 },
        5: { cellWidth: 35 },
      },
      didParseCell: (data) => {
        // Color compliance cells
        if (data.section === "body" && data.column.index === 1) {
          if (data.cell.raw === "Yes") {
            data.cell.styles.textColor = [22, 163, 74]; // green
            data.cell.styles.fontStyle = "bold";
          } else if (data.cell.raw === "No") {
            data.cell.styles.textColor = [220, 38, 38]; // red
            data.cell.styles.fontStyle = "bold";
          } else if (data.cell.raw === "Partial") {
            data.cell.styles.textColor = [234, 179, 8]; // yellow/orange
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });

    // @ts-expect-error - jspdf-autotable types are imperfect
    const lastY = doc.lastAutoTable.finalY;
    y = lastY + 10;
  });

  // === Final Score Summary ===
  if (y > doc.internal.pageSize.getHeight() - 30) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(30, 58, 95);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 14, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("Final Total Score", margin + 6, y + 9);

  const finalText = `${totalScore} / ${maxScore}  (${pct}%)`;
  doc.setFontSize(13);
  doc.text(finalText, pageWidth - margin - 6 - doc.getTextWidth(finalText), y + 9);

  y += 20;

  // Signature lines
  if (y > doc.internal.pageSize.getHeight() - 40) {
    doc.addPage();
    y = 20;
  }

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  const colW = (pageWidth - margin * 2 - 20) / 2;

  doc.line(margin, y + 10, margin + colW, y + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text("Auditor Signature", margin, y + 15);

  doc.line(margin + colW + 20, y + 10, pageWidth - margin, y + 10);
  doc.text("Date", margin + colW + 20, y + 15);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(160, 160, 160);
    const footerY = doc.internal.pageSize.getHeight() - 8;
    doc.text(`Generated by Checklist Champion — ${reportDate}`, margin, footerY);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin - doc.getTextWidth(`Page ${p} of ${totalPages}`), footerY);
  }

  // Download
  const safeName = templateName.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`${safeName}_${new Date().toISOString().split("T")[0]}.pdf`);
};
