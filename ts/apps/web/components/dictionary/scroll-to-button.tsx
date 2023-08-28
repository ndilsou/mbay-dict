"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export function ScrollToButton({
  className,
  variant = "top",
  href,
}: {
  className?: string;
  variant: "top" | "bottom";
  href: string;
}) {
  // const pathname = usePathname();

  // const [coords, setCoords] = useState<{ top: number; left: number }>({
  //   top: 0,
  //   left: 0,
  // });

  // useEffect(() => {
  //   if (variant === "bottom") {
  //     setCoords({
  //       top: document.getElementById("page-main")?.scrollHeight || 0,
  //       left: 0,
  //     });
  //     console.log(
  //       "setting bottom coords to",
  //       document.getElementById("page-main")?.scrollHeight
  //     );
  //   }
  // }, [variant, pathname]);

  // useEffect(() => {
  //   const element = document.getElementById("page-main");

  //   if (element && variant === "bottom") {
  //     const resizeObserver = new ResizeObserver((e) => {
  //       console.log("resizing", e);
  //       console.log("scrollHeight", element.scrollHeight);
  //       console.log("scrollHeight", e[0].target.scrollHeight);
  //       setCoords({
  //         top: element.scrollHeight || 0,
  //         left: 0,
  //       });
  //     });

  //     resizeObserver.observe(element);

  //     // Clean up function
  //     return () => {
  //       resizeObserver.unobserve(element);
  //     };
  //   }
  // }, [variant]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();

    const targetId = e.currentTarget.href.replace(/.*\#/, "");

    const elem = document.getElementById(targetId);
    elem?.scrollTo({
      behavior: "smooth",
      top: elem?.getBoundingClientRect().top,
    });
    // console.log("scrolling to", elem?.getBoundingClientRect().top);

    // const top = elem?.getBoundingClientRect().bottom;
    // elem?.scrollTo({
    //   behavior: "smooth",
    //   top,
    //   // ...coords,
    // });
    // console.log("scrolling to", top);
  }

  return (
    <Link href={href} onClick={handleClick}>
      <Button variant="ghost" size="icon" className={cn("h-4", className)}>
        {
          {
            top: <ArrowUpToLine />,
            bottom: <ArrowDownToLine />,
          }[variant]
        }
      </Button>
    </Link>
  );
}
