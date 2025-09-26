import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import Nav from "@/components/home/nav";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Resource from "@/components/home/Resource";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Nav />

      {/* Hero Section */}
      <Hero />

      {/* Features Grid */}
      <Features />

      {/* Resource Types */}
      <Resource />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-4xl font-bold mb-6 text-balance">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 text-balance">
            Join thousands of Concordia students and faculty who are already
            using our platform to efficiently manage their campus resource
            needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold">Campus Resources</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Concordia University&apos;s comprehensive resource booking and
                management system.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/browse"
                    className="hover:text-foreground transition-colors"
                  >
                    Browse Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-bookings"
                    className="hover:text-foreground transition-colors"
                  >
                    My Bookings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="hover:text-foreground transition-colors"
                  >
                    Account Settings
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Administrators</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/admin"
                    className="hover:text-foreground transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/resources"
                    className="hover:text-foreground transition-colors"
                  >
                    Manage Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/reports"
                    className="hover:text-foreground transition-colors"
                  >
                    Usage Reports
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/status"
                    className="hover:text-foreground transition-colors"
                  >
                    System Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2025 Concordia University. All rights reserved. | SOEN 287
              Web Programming Project
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
