"use client";

import { Button } from "@/components/ui/button";

export default function Cta() {
  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-4xl font-bold mb-6 text-balance">
          Ready to Get Started?
        </h2>
        <p className="text-xl mb-8 text-primary-foreground/90 text-balance">
          Join thousands of Concordia students and faculty who are already using
          our platform to efficiently manage their campus resource needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
            Create Account
          </Button>
        </div>
      </div>
    </section>
  );
}
