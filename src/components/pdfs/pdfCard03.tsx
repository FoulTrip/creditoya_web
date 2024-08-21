"use client";

import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import skeletonPdf from "@/components/Jsons/promissory.json";
import { DocumentTypes04 } from "@/types/PDFs";

interface PdfViewProps {
  name: string;
  numberDocument: string;
  signature?: string;
}

function Document03({ name, numberDocument, signature }: PdfViewProps) {
  const [jsonData, setJsonData] = useState<DocumentTypes04>(skeletonPdf);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Actualiza los datos del JSON con la información proporcionada
  useEffect(() => {
    const updatedJsonData = { ...skeletonPdf };

    updatedJsonData.firstParagraph.namePerson = name;
    updatedJsonData.firstParagraph.numberDocument = numberDocument;
    updatedJsonData.signature = signature as string;
    updatedJsonData.numberDocument = numberDocument;

    setJsonData(updatedJsonData);
  }, [name, numberDocument, signature]);

  // Función para cargar imágenes de forma asíncrona
  const loadImageAsync = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  // Genera el PDF cuando los datos se actualizan
  useEffect(() => {
    const generatePdf = async () => {
      const doc = new jsPDF();
      let y = 8;

      try {
        // Cargar logo y firma de forma asincrónica
        const [logo, signatureImg] = await Promise.all([
          loadImageAsync(jsonData.logoHeader),
          loadImageAsync(jsonData.signature),
        ]);

        // Agregar logo al PDF
        const imgWidth = 70;
        const imgHeight = (logo.height * imgWidth) / logo.width;
        doc.addImage(logo, "PNG", 10, y, imgWidth, imgHeight);
        y += 28;

        // Agregar texto al PDF
        doc.setFontSize(10);
        doc.text(
          jsonData.numero_pagare.publicText + ` _________________`,
          10,
          y
        );
        y += 10;
        doc.text(
          jsonData.fecha_vencimiento.publicText + ` _________________`,
          10,
          y
        );
        y += 10;

        const firstParagraph = `${jsonData.firstParagraph.namePerson} ${jsonData.firstParagraph.publicfirstText} ${jsonData.firstParagraph.numberDocument} ${jsonData.firstParagraph.publicSecondText} _________________ ${jsonData.firstParagraph.publicFiveText} _________________`;
        doc.text(firstParagraph, 10, y, { maxWidth: 190 });
        y += 15;

        doc.text(jsonData.secondParagraph, 10, y, { maxWidth: 180 });
        y += 68;

        doc.text(jsonData.threeParagraph, 10, y, { maxWidth: 180 });
        y += 25;

        doc.text(jsonData.fourParagraph, 10, y, { maxWidth: 180 });
        y += 85;

        const fiveParagraph = `${jsonData.fiveParagraph.publicFirstText} ${jsonData.fiveParagraph.publicSecondText} _________________`;
        doc.text(fiveParagraph, 10, y, { maxWidth: 190 });
        y += 10;

        // Agregar firma al PDF
        const sigWidth = 50;
        const sigHeight = (signatureImg.height * sigWidth) / signatureImg.width;
        doc.addImage(signatureImg, "PNG", 10, y, sigWidth, sigHeight);

        // Línea y texto debajo de la firma
        const lineY = y + sigHeight + 2;
        doc.line(10, lineY, 10 + sigWidth, lineY);
        doc.text("Firma del solicitante", 10, lineY + 6);

        // Agregar número de documento al lado de la firma
        const docX = 70;
        const docY = y + sigHeight / 1;
        doc.text(`${jsonData.numberDocument}`, docX, docY);
        doc.line(docX, docY + 2, docX + 40, docY + 2);
        doc.text("C.C.", docX, docY + 6);

        // Convertir a Blob y generar URL
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(pdfUrl);
      } catch (error) {
        console.error("Error al cargar imágenes:", error);
      }
    };

    generatePdf();
  }, [jsonData]);

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

export default Document03;
