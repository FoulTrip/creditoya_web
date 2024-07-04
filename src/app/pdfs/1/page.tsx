import PdfCard06 from "@/components/pdfs/pdfCard06";
import React from "react";
import jsonData from "@/components/Jsons/promissory.json";

function PdfOne() {
  return (
    <PdfCard06
      name={"David Vasquez"}
      datePay={"02 Noviembre 2024"}
      numberDocument={"1006110803"}
      payQuantity={"3000000"}
      expirationDay={"03 Diciembre 2024"}
    />
  );
}

export default PdfOne;
