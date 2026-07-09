import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDFFromLayout = async (
  containerId: string, 
  filename: string = 'AI_Chat_Export.pdf'
): Promise<void> => {
  const container = document.getElementById(containerId);
  if (!container) throw new Error('PDF Layout container not found.');

  const blocks = container.querySelectorAll('.pdf-block');
  if (blocks.length === 0) throw new Error('No content blocks found to export.');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  const margin = 15;
  const usableWidth = pdfWidth - 2 * margin;
  const usableHeight = pdfHeight - 2 * margin;

  let cursorY = margin;
  let pageNum = 1;

  for (let i = 0; i < blocks.length; i++) {
    const el = blocks[i] as HTMLElement;
    
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#f8fafc',
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (cursorY + imgHeight > usableHeight && cursorY > margin) {
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text(`Page ${pageNum}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      
      pdf.addPage();
      pageNum++;
      cursorY = margin;
    }

    pdf.addImage(imgData, 'PNG', margin, cursorY, imgWidth, imgHeight);
    cursorY += imgHeight + 6; 
  }

  pdf.setFontSize(10);
  pdf.setTextColor(150);
  pdf.text(`Page ${pageNum}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });

  pdf.save(filename);
};
