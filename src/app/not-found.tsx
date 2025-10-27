"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/browse", label: "Browse Resources" },
    { href: "/create-account", label: "Create Account" },
  ];
  return (
    <div className="flex-1 flex flex-col justify-center items-center gap-6 min-h-72">
      <h2 className="text-3xl">404 Page Not Found</h2>

      <div className="border-1 border-b w-2xs"></div>
      <span className="text-sm text-gray-600">
        If you believe this is an error, please contact our support team.
      </span>
      <div className="flex flex-col items-center justify-center gap-2 text-center px-4">
        <div className="flex gap-2">
          {links.map((link) => (
            <Button key={link.href} asChild>
              <Link href={link.href} className="text-sm hover:underline">
                {link.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
