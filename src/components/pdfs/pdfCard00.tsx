"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import skeletonPdf from "@/components/Jsons/AboutLoan.json";
import { DocumentTypes00 } from "@/types/PDFs";

interface PdfViewProps {
  numberDocument: string;
  entity: string;
  numberBank: string;
  signature?: string;
  autoDownload?: boolean;
}

interface TextOptions {
  maxWidth?: number;
  // Agrega otros posibles campos que necesites según la documentación de jsPDF
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

const addText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  options?: TextOptions
) => {
  doc.text(text, x, y, options);
};

const addSignature = (
  doc: jsPDF,
  img: HTMLImageElement,
  x: number,
  y: number,
  label: string
) => {
  const imgWidth = 50;
  const imgHeight = (img.height * imgWidth) / img.width;

  doc.addImage(img, "PNG", x, y, imgWidth, imgHeight);
  const lineY = y + imgHeight + 2;
  doc.line(x, lineY, x + imgWidth, lineY);
  addText(doc, label, x, lineY + 6);
};

const Document00: React.FC<PdfViewProps> = ({
  numberDocument,
  signature,
  numberBank,
  entity,
  autoDownload = false,
}) => {
  const [jsonData, setJsonData] = useState<DocumentTypes00>(skeletonPdf);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const updatedJsonData = {
      ...skeletonPdf,
      optionAccount: {
        entityAccount: entity,
        numberAccount: numberBank,
      },
    };
    setJsonData(updatedJsonData);
  }, [entity, numberBank]);

  useEffect(() => {
    const generatePdf = async () => {
      const doc = new jsPDF();
      doc.setFontSize(10);
      let y = 15;

      addText(
        doc,
        `${jsonData.TitlePrevExplain}${jsonData.prevExplain}`,
        10,
        y,
        { maxWidth: 190 }
      );
      y += 90;

      addText(
        doc,
        `${jsonData.headerTitle} ${jsonData.firstExplainText} `,
        10,
        y,
        { maxWidth: 190 }
      );
      y += 167;

      addText(doc, jsonData.secondTitle, 10, y, { maxWidth: 190 });
      y += 10;

      doc.setFontSize(13);
      addText(
        doc,
        `Cuenta Ahorros Nro. Cuenta ${jsonData.optionAccount.numberAccount} Entidad: ${jsonData.optionAccount.entityAccount}`,
        10,
        y,
        { maxWidth: 190 }
      );
      y += -265;

      doc.setFontSize(10);
      doc.addPage();

      addText(doc, jsonData.threeTitle, 10, y, { maxWidth: 190 });
      y += 5;

      addText(doc, jsonData.justifyText, 10, y, { maxWidth: 190 });
      y += 15;

      addText(doc, jsonData.numberOnce + jsonData.textOnce, 10, y, {
        maxWidth: 190,
      });
      y += 25;

      addText(doc, jsonData.finalTitle, 10, y, { maxWidth: 190 });
      y += 6;

      addText(doc, jsonData.subFinalText, 10, y, { maxWidth: 190 });
      y += 65;

      addText(doc, jsonData.finalText, 10, y, { maxWidth: 190 });
      y += 10;

      if (signature) {
        try {
          const img = await loadImage(signature);
          addSignature(doc, img, 10, y, "Firma del solicitante");

          const docX = 70;
          const docY = y + (img.height * 50) / img.width / 1;
          addText(doc, numberDocument, docX, docY);
          doc.line(docX, docY + 2, docX + 40, docY + 2);
          addText(doc, "C.C.", docX, docY + 6);

          const pdfBlob = doc.output("blob");
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPdfUrl(pdfUrl);

          if (autoDownload) {
            const link = document.createElement("a");
            link.href = pdfUrl;
            link.download = `document_${numberDocument}.pdf`;
            link.click();
            URL.revokeObjectURL(pdfUrl);
          }
        } catch (error) {
          console.error("Error loading signature image", error);
        }
      }
    };

    generatePdf();
  }, [jsonData, numberDocument, signature, autoDownload]);

  return (
    <>
      {pdfUrl && !autoDownload && (
        <iframe
          src={pdfUrl}
          width={"100%"}
          height={"100%"}
          style={{ border: "none", marginTop: "1em", height: "100dvh" }}
        ></iframe>
      )}
    </>
  );
};

export default Document00;
