// src/lib/pdf-utils.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // 1. Capture the element as a high-res canvas
  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale = better quality
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  
  // 2. Initialize PDF (A4 size)
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  // 3. Add image to PDF
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${fileName}.pdf`);
};