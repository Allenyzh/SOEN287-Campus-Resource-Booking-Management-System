"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import type { NavItem } from "@/components/home/nav";
import { Menu, MoveRight } from "lucide-react";

interface SideDrawerProps {
  navItems: NavItem[];
}

export default function SideDrawer({ navItems }: SideDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <Menu className="w-5 h-5" />
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="pb-0">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Quick links to campus resource tools and support.
          </SheetDescription>
        </SheetHeader>
        <nav className="px-4 flex flex-col">
          {navItems.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="group text-foreground hover:text-primary hover:bg-gray-100 active:text-primary rounded-md py-2 transition-colors flex items-center gap-2 pr-8 pl-4"
              >
                <span className="flex-1">{item.label}</span>
                <MoveRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-active:translate-x-1 " />
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
