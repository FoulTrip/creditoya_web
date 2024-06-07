interface NumeroPagare {
  publicText: string;
  publicId: string;
}

interface FechaVencimiento {
  publicText: string;
  date: string;
}

interface FirstParagraph {
  namePerson: string;
  publicfirstText: string;
  numberDocument: string;
  publicSecondText: string;
  payDay: string;
  publicFiveText: string;
  payQuantity: string;
}

interface FiveParagraph {
  publicFirstText: string;
  publicSecondText: string;
  dayPay: string;
}

export interface DocumentPromissory {
  logoHeader: string;
  numero_pagare: NumeroPagare;
  fecha_vencimiento: FechaVencimiento;
  firstParagraph: FirstParagraph;
  secondParagraph: string;
  threeParagraph: string;
  fourParagraph: string;
  fiveParagraph: FiveParagraph;
  signature: string;
  numberDocument: string;
}
