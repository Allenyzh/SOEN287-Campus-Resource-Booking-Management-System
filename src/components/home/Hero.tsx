"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 leading-tight">
          Book Campus Resources
          <span className="text-primary block">Effortlessly</span>
        </h1>
        <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed max-w-2xl mx-auto">
          Access study rooms, labs, equipment, and facilities across Concordia
          University. Real-time availability, instant booking, and seamless
          management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-6">
            <Calendar className="w-5 h-5 mr-2" />
            Browse Available Resources
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 bg-transparent"
          >
            <Users className="w-5 h-5 mr-2" />
            Admin Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
}
