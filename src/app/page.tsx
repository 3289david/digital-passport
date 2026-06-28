import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Platforms } from "@/components/landing/Platforms";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)" }}>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Platforms />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
