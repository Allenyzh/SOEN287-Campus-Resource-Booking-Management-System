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
      { href: "/dashboard", label: "My Bookings" },
    ],
  },
  {
    title: "For Administrators",
    links: [
      { href: "/admin", label: "Admin Dashboard" },
      // { href: "/admin/resources", label: "Manage Resources" },
    ],
  },
];
