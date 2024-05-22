"use client";

import HeroinSection from "@/components/Landing/HeroinSection";
import RequirementsComponents from "@/components/Landing/Requirements";
import ServiceSection from "@/components/Landing/ServiceSection";
import StepSection from "@/components/Landing/Steps";
import IntFooter from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <HeroinSection />
      <ServiceSection />
      <StepSection />
      <RequirementsComponents />
      <IntFooter />
    </>
  );
}
