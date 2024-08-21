"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import skeletonPdf from "@/components/Jsons/card02.json";
import sub_skeletonPdf from "@/components/Jsons/card02-sub.json";

interface PdfViewProps {
  name: string;
  numberDocument: string;
  signature?: string;
}

function Document02({ name, numberDocument, signature }: PdfViewProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const doc = new jsPDF();
    doc.setFontSize(10);

    const addSignatureAndDocument = (
      yPosition: number,
      image: HTMLImageElement
    ) => {
      const imgWidth = 50;
      const imgHeight = (image.height * imgWidth) / image.width;

      doc.addImage(image, "PNG", 10, yPosition, imgWidth, imgHeight);

      const lineY = yPosition + imgHeight + 2;
      doc.line(10, lineY, 10 + imgWidth, lineY);
      doc.text("Firma del solicitante", 10, lineY + 6);

      const docX = 70;
      const docY = yPosition + imgHeight / 1;
      doc.text(numberDocument, docX, docY);

      doc.line(docX, docY + 2, docX + 40, docY + 2);
      doc.text("C.C.", docX, docY + 6);
    };

    const img = new Image();
    img.src = signature as string;

    img.onload = () => {
      let y = 8;
      doc.text(skeletonPdf.title, 10, y, { maxWidth: 190 });
      y += 8;

      doc.text(skeletonPdf.firstParagraph + " ______________________", 10, y, {
        maxWidth: 190,
      });
      y += 5;

      doc.text(skeletonPdf.subFirstParagraph, 10, y, {
        maxWidth: 190,
      });
      y += 50;

      doc.text(skeletonPdf.secondParagraph, 10, y, { maxWidth: 190 });
      y += 30;

      doc.text(skeletonPdf.thirdParagraph, 10, y, { maxWidth: 190 });
      y += 49;

      doc.text(
        skeletonPdf.footer +
          " _________________ a los ___________ dias del mes de ___________ de _____________.",
        10,
        y,
        { maxWidth: 190 }
      );
      y += 20;

      addSignatureAndDocument(y, img);

      doc.addPage();
      let y2 = 8;

      doc.text(sub_skeletonPdf.title, 10, y2, { maxWidth: 190 });
      y2 += 10;

      doc.text(
        sub_skeletonPdf.firstParagraph + " ______________________",
        10,
        y2,
        { maxWidth: 190 }
      );
      y2 += 4;

      doc.text(
        sub_skeletonPdf.subFirstParagraph +
          " $ ____________________LETRAS (___________________) " +
          sub_skeletonPdf.TwoSubFirstParagraph +
          "____" +
          sub_skeletonPdf.ThreeSubFirstParagraph +
          " $____________________LETRAS(____________________________________) " +
          sub_skeletonPdf.FourSubFirstParagraph +
          "______" +
          sub_skeletonPdf.FiveSubFirstParagraph,
        10,
        y2,
        { maxWidth: 190 }
      );
      y2 += 53;

      doc.text(sub_skeletonPdf.secondParagraph, 10, y2, { maxWidth: 190 });
      y2 += 30;

      doc.text(sub_skeletonPdf.thirdParagraph, 10, y2, { maxWidth: 190 });
      y2 += 53;

      doc.text(
        sub_skeletonPdf.footer +
          " ________________ a los _____________________ dias del mes de ______________________ de ____________",
        10,
        y2,
        { maxWidth: 190 }
      );
      y2 += 20;

      addSignatureAndDocument(y2, img);

      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    };
  }, [numberDocument, signature]);

  return (
    <>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width={"100%"}
          height={"100%"}
          style={{ border: "none", marginTop: "1em", height: "100dvh" }}
        ></iframe>
      )}
    </>
  );
}

export default Document02;
