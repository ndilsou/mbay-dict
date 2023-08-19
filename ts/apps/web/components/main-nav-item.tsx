"use client"
import * as React from "react";
import Link from "next/link";
import { NavItem } from "@/types/nav";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MainNavItem({ item }: { item: NavItem; }) {
  const pathname = usePathname();
  return item.href ? (
    <Link
      href={item.href}
      className={cn(
        "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
        item.disabled && "cursor-not-allowed opacity-80", item.href === pathname && "text-primary"
      )}
    >
      {item.title}
    </Link>
  ) : null;
}
