"use client";

import { Button } from "@/components/ui/button";
import * as React from "react";
import { SidebarContext, useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";

export function CustomTrigger() {
  const { state, toggleSidebar } = useSidebar();

  const iconSrc = state === "expanded" ? "/icons/close.svg" : "/icons/open.svg";
  const altSrc = state === "expanded" ? "Collapse Sidebar" : "Expand Sidebar";

  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  console.log(context);

  return (
    <Button
      variant="ghost"
      size="toggle"
      className="gap-0 absolute top-1/2"
      onClick={toggleSidebar}
    >
      <Image src={iconSrc} alt={altSrc} width={24} height={64} />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
