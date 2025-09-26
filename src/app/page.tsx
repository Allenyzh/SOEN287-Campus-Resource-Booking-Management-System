import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Resource from "@/components/home/Resource";
import Cta from "@/components/home/Cta";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Features Grid */}
      <Features />

      {/* Resource Types */}
      <Resource />

      {/* CTA Section */}
      <Cta />
    </div>
  );
}
