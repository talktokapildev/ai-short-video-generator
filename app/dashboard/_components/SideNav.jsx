"use client";
import { CircleUser, FileVideo, PanelsTopLeft, ShieldPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function SideNav() {
  const MenuOptions = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: PanelsTopLeft,
    },
    {
      id: 2,
      name: "Create New",
      path: "/dashboard/create-new",
      icon: FileVideo,
    },
    {
      id: 3,
      name: "Upgrade",
      path: "/upgrade",
      icon: ShieldPlus,
    },
    {
      id: 4,
      name: "Account",
      path: "/account",
      icon: CircleUser,
    },
  ];
  const path = usePathname();
  return (
    <div className="w-64 h-screen shadow-md p-5">
      <div className="grid gap-2">
        {MenuOptions.map((menu) => (
          <Link href={menu.path} key={menu.id}>
            <div
              key={menu.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-primary hover:text-white rounded-md ${
                path === menu.path ? "bg-primary text-white" : "text-primary"
              }`}
            >
              <menu.icon />
              <h2>{menu.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SideNav;
