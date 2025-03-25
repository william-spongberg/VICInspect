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
      label: "About",
      href: "/about",
    },
    {
      label: "Privacy",
      href: "/privacy",
    }
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Privacy",
      href: "/privacy",
    }
  ],
  links: {
    github: "https://github.com/william-spongberg/ptv-inspector-tracker",
  },
};
