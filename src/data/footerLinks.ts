export type FooterLink = {
  href: string;
  label: string;
};

export type FooterLinkSection = {
  title: string;
  links: FooterLink[];
};

export const footerSections: FooterLinkSection[] = [
  {
    title: "For Students",
    links: [
      { href: "/browse", label: "Browse Resources" },
      { href: "/mybookings", label: "My Bookings" },
      { href: "/profile", label: "Account Settings" },
    ],
  },
  {
    title: "For Administrators",
    links: [
      { href: "/underconstruction", label: "Admin Dashboard" },
      { href: "/underconstruction", label: "Manage Resources" },
      { href: "/underconstruction", label: "Usage Reports" },
    ],
  },
  {
    title: "Support",
    links: [{ href: "/help", label: "Help Center" }],
  },
];
