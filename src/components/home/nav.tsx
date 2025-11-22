"use client";

import Link from "next/link";
import { BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import SideDrawer from "@/components/home/SideDrawer";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeButton from "./ThemeButton";
import { useAuthStore } from "@/stores/authStore";

export interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Browse Resources",
    href: "/browse",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
];

const adminNavItems: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Admin Dashboard",
    href: "/admin",
  },
  {
    label: "Resources",
    href: "/admin/resources",
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
  },
  {
    label: "Reports",
    href: "/admin/reports",
  },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const currentNavItems = user?.role === "admin" ? adminNavItems : navItems;
  const activeLink =
    currentNavItems.find((item) => item.href === pathname)?.label ?? "";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/70 hover:scale-105 active:scale-95 transition-colors"
            >
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </Link>

            <div className="hidden sm:block">
              <h1 className="text-xl font-semibold text-foreground">
                Campus Resources
              </h1>
              <p className="text-sm text-muted-foreground">
                Concordia University
              </p>
            </div>
          </div>
          <nav className="hidden xl:flex items-center space-x-6">
            {currentNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-foreground hover:text-primary hover:dark:text-black transition-colors hover:bg-gray-200 active:dark:text-black py-2 px-4 rounded-md",
                  item.label === activeLink &&
                    "bg-gray-200 font-bold dark:text-black "
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-secondary rounded-md">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {user.name}
                    </span>
                    {user.role === "admin" && (
                      <span className="text-xs text-primary font-semibold">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/create-account">Get Started</Link>
                </Button>
              </>
            )}
            <div className="hidden xl:block">
              <ThemeButton />
            </div>
            <SideDrawer navItems={currentNavItems} />
          </div>
        </div>
      </div>
    </header>
  );
}
