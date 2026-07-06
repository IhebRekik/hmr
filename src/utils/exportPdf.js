import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

async function buildPdfBlob(element) {
  if (!element) {
    throw new Error("Élément de prévisualisation introuvable.");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  if (!canvas.width || !canvas.height) {
    throw new Error("Impossible de capturer le document.");
  }

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * pageWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf.output("blob");
}

async function saveWithPicker(blob, filename) {
  if (!window.showSaveFilePicker) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const handle = await window.showSaveFilePicker({
    suggestedName: filename,
    types: [
      {
        description: "Document PDF",
        accept: { "application/pdf": [".pdf"] },
      },
    ],
  });

  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}

export async function exportToPdf(element, filename) {
  const blob = await buildPdfBlob(element);
  await saveWithPicker(blob, filename);
}
