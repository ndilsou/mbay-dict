import * as React from "react"
import Link from "next/link"
import { SetRequired } from "type-fest"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"

import { MainNavItem } from "./main-nav-item"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <div className="rounded-lg bg-black dark:bg-inherit">
          <Icons.logo className="h-10 w-10" />
        </div>
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <MainNavItem key={index} item={item} />
          ))}
        </nav>
      ) : null}
    </div>
  )
}
