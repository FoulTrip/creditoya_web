"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Importa los componentes de forma dinámica
const HeroinSection = dynamic(
  () => import("@/components/Landing/HeroinSection")
);
const RequirementsComponents = dynamic(
  () => import("@/components/Landing/Requirements")
);
const ServiceSection = dynamic(
  () => import("@/components/Landing/ServiceSection")
);
const StepSection = dynamic(() => import("@/components/Landing/Steps"));
const IntFooter = dynamic(() => import("@/components/footer/Footer"));

export default function Home() {
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <HeroinSection />
        <ServiceSection />
        <StepSection />
        <RequirementsComponents />
        <IntFooter />
      </Suspense>
    </>
  );
}
