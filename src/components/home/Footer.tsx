import { footerSections, type FooterLinkSection } from "@/data/footerLinks";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 pt-12 pb-8 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {footerSections.map((section: FooterLinkSection) => (
            <div key={section.title} className="mx-auto">
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 md:pt-8 pt-4 text-center text-sm text-muted-foreground">
          <p>
            &copy; 2025 Concordia University. All rights reserved. | SOEN 287
            Web Programming Project
          </p>
        </div>
      </div>
    </footer>
  );
}
