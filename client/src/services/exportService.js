import { dataToCSV } from './excelParser';

export async function exportDashboardPNG(elementId = 'dashboard-content') {
  const { default: html2canvas } = await import('html2canvas');
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Dashboard element not found');
  const canvas = await html2canvas(element, {
    backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
    scale: 2,
    useCORS: true,
    logging: false,
  });
  const link = document.createElement('a');
  link.download = `hr-dashboard-${new Date().toISOString().split('T')[0]}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function exportPDF(reportMarkdown, title = 'HR Analytics Report') {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let y = margin;
  const lines = reportMarkdown.split('\n');
  for (const line of lines) {
    if (y > pageHeight - margin) { doc.addPage(); y = margin; }
    if (line.startsWith('# ')) {
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(line.replace(/^#+\s*/, ''), margin, y);
      y += 10;
    } else if (line.startsWith('## ')) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(line.replace(/^#+\s*/, ''), margin, y);
      y += 8;
    } else if (line.startsWith('### ')) {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(line.replace(/^#+\s*/, ''), margin, y);
      y += 7;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const text = '  \u2022 ' + line.replace(/^[-*]\s*/, '').replace(/\*\*/g, '');
      const splitText = doc.splitTextToSize(text, maxWidth - 5);
      splitText.forEach(t => {
        if (y > pageHeight - margin) { doc.addPage(); y = margin; }
        doc.text(t, margin + 5, y);
        y += 5;
      });
    } else if (line.trim() === '') {
      y += 3;
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const cleanText = line.replace(/\*\*/g, '').replace(/\*/g, '');
      const splitText = doc.splitTextToSize(cleanText, maxWidth);
      splitText.forEach(t => {
        if (y > pageHeight - margin) { doc.addPage(); y = margin; }
        doc.text(t, margin, y);
        y += 5;
      });
    }
  }
  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export async function exportWord(reportMarkdown, title = 'HR Analytics Report') {
  const docxModule = await import('docx');
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docxModule;
  const children = [];
  const lines = reportMarkdown.split('\n');
  for (const line of lines) {
    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.replace(/^#+\s*/, ''), bold: true, size: 36 })],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }));
    } else if (line.startsWith('## ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.replace(/^#+\s*/, ''), bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 150 },
      }));
    } else if (line.startsWith('### ')) {
      children.push(new Paragraph({
        children: [new TextRun({ text: line.replace(/^#+\s*/, ''), bold: true, size: 24 })],
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 },
      }));
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.replace(/^[-*]\s*/, '').replace(/\*\*/g, '');
      children.push(new Paragraph({
        children: [new TextRun({ text, size: 22 })],
        bullet: { level: 0 },
        spacing: { after: 50 },
      }));
    } else if (line.trim() === '---') {
      children.push(new Paragraph({ children: [], spacing: { after: 200 } }));
    } else if (line.trim() !== '') {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const runs = parts.map((part, i) => new TextRun({ text: part, bold: i % 2 === 1, size: 22 }));
      children.push(new Paragraph({ children: runs, spacing: { after: 100 } }));
    }
  }
  const doc = new Document({ sections: [{ children }] });
  const buffer = await Packer.toBlob(doc);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(buffer);
  link.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportMarkdown(reportMarkdown, title = 'HR Analytics Report') {
  const blob = new Blob([reportMarkdown], { type: 'text/markdown;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.md`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportCSV(data) {
  const csv = dataToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `hr-data-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
