"use client";

import { useState } from "react";
import { Eye, User } from "lucide-react";
import { Tabs } from "@/components/ui/tabs";

export function TabsDemo() {
  const [tab, setTab] = useState("about");

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      items={[
        { id: "timeline", label: "Timeline", icon: <Eye /> },
        { id: "about", label: "About", icon: <User /> },
      ]}
    />
  );
}
