import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import SideDrawer from "@/components/home/SideDrawer";

export interface NavItem {
  label: string;
  href: string;
}

export default function Nav() {
  const navItems: NavItem[] = [
    {
      label: "Browse Resources",
      href: "/browse",
    },
    {
      label: "My Bookings",
      href: "/my-bookings",
    },
    {
      label: "Help",
      href: "/help",
    },
  ];
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground">
                Campus Resources
              </h1>
              <p className="text-sm text-muted-foreground">
                Concordia University
              </p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
            <SideDrawer navItems={navItems} />
          </div>
        </div>
      </div>
    </header>
  );
}
