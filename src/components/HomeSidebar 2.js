"use client";

import Link from "next/link";
import { Gift, CalendarRange, CircleUser, Package } from "lucide-react";

const projects = [
  {
    name: "Gifts",
    url: "/gifts",
    icon: Gift,
  },
  {
    name: "Items",
    url: "/items",
    icon: Package,
  },
  {
    name: "Event",
    url: "/events",
    icon: CalendarRange,
  },
  {
    name: "Profile",
    url: "/profile",
    icon: CircleUser,
  },
];

const HomeSidebar = () => {
  return (
    <div className="h-screen backdrop-blur bg-beige text-black  p-4 md:ps-24 flex flex-col w-16 md:w-1/4 transition-all ">
      <nav className="flex flex-col space-y-6 items">
        {projects.map((project) => (
          <SidebarItem
            key={project.name}
            icon={<project.icon className="w-6 h-6" />}
            label={project.name}
            url={project.url}
          />
        ))}
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, url }) => {
  return (
    <Link
      href={url}
      className="flex items-center space-x-4 hover:bg-red-400 hover:text-green-900   p-2 rounded-md cursor-pointer"
    >
      {icon}
      <span className="hidden md:inline-block text-lg font-semibold">{label}</span>
    </Link>
  );
};

export default HomeSidebar;
