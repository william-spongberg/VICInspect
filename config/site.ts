export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "PTV Inspector Tracker",
  description: "Track, avoid and report PTV Inspectors in real-time.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Privacy",
      href: "/privacy",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Privacy",
      href: "/privacy",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/william-spongberg/ptv-inspector-tracker",
  },
};
