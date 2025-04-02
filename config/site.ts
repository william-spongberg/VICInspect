export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "TransitEye",
  description: "Track, avoid and report PTV Inspectors in real-time.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Map",
      href: "/map",
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
      label: "Map",
      href: "/map",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/william-spongberg/transit-eye",
  },
};
