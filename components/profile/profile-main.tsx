"use client";

import { useState } from "react";
import {
  Bookmark,
  Check,
  Eye,
  Flag,
  MapPin,
  MessageSquare,
  Star,
  ThumbsUp,
  User,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataList, DataListItem, SectionLabel } from "@/components/ui/data-list";
import { Rating } from "@/components/ui/rating";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "timeline", label: "Timeline", icon: <Eye /> },
  { id: "about", label: "About", icon: <User /> },
];

const timeline = [
  {
    icon: <Star />,
    title: "Recebeu uma avaliação 5 estrelas",
    meta: "Spotify New York · há 2 dias",
  },
  {
    icon: <UserPlus />,
    title: "Conectou-se com Marina Alves",
    meta: "Metropolitan Museum · há 6 dias",
  },
  {
    icon: <ThumbsUp />,
    title: "Publicou o case “Rebranding Kodecolor”",
    meta: "Branding · há 3 semanas",
  },
];

export function ProfileMain() {
  const [tab, setTab] = useState("about");
  const [bookmarked, setBookmarked] = useState(false);
  const [connected, setConnected] = useState(true);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <h1 className="text-3xl">Jeremy Rose</h1>
          <span className="text-content-muted flex items-center gap-1 text-sm">
            <MapPin className="size-4" />
            New York, NY
          </span>
        </div>

        <button
          type="button"
          onClick={() => setBookmarked((value) => !value)}
          aria-pressed={bookmarked}
          className={cn(
            "ml-auto flex cursor-pointer items-center gap-2 text-sm font-medium",
            "transition-colors duration-150 ease-in-out",
            bookmarked
              ? "text-primary"
              : "text-content-muted hover:text-content-secondary",
          )}
        >
          <Bookmark
            className={cn("size-4", bookmarked && "fill-primary")}
          />
          Bookmark
        </button>
      </div>

      <p className="text-primary -mt-4 text-sm font-medium">Product Designer</p>

      <div className="flex flex-col gap-1">
        <SectionLabel>Rankings</SectionLabel>
        <Rating value={8.6} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" className="px-0 hover:bg-transparent">
          <MessageSquare />
          Send message
        </Button>
        <Button
          variant={connected ? "subtle" : "primary"}
          onClick={() => setConnected((value) => !value)}
        >
          {connected ? <Check /> : <UserPlus />}
          Contacts
        </Button>
        <Button variant="ghost" className="text-content-muted">
          <Flag />
          Report user
        </Button>
      </div>

      <Tabs items={tabs} value={tab} onValueChange={setTab} className="mt-2" />

      {tab === "about" ? (
        <div className="flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <SectionLabel>Contact information</SectionLabel>
            <DataList>
              <DataListItem label="Phone">
                <a
                  href="tel:+11234567890"
                  className="text-primary hover:text-primary-hover transition-colors duration-150 ease-in-out"
                >
                  +1 123 456 7890
                </a>
              </DataListItem>
              <DataListItem label="Address">
                525 E 68th Street
                <br />
                New York, NY 10651-78 156-187-60
              </DataListItem>
              <DataListItem label="E-mail">
                <a
                  href="mailto:hello@jeremyrose.com"
                  className="text-primary hover:text-primary-hover transition-colors duration-150 ease-in-out"
                >
                  hello@jeremyrose.com
                </a>
              </DataListItem>
              <DataListItem label="Site">
                <a
                  href="https://www.jeremyrose.com"
                  className="text-primary hover:text-primary-hover transition-colors duration-150 ease-in-out"
                >
                  www.jeremyrose.com
                </a>
              </DataListItem>
            </DataList>
          </section>

          <section className="flex flex-col gap-4">
            <SectionLabel>Basic information</SectionLabel>
            <DataList>
              <DataListItem label="Birthday">June 5, 1992</DataListItem>
              <DataListItem label="Gender">Male</DataListItem>
            </DataList>
          </section>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {timeline.map((item) => (
            <li
              key={item.title}
              className="border-border hover:bg-surface-muted flex items-start gap-4 rounded-md border p-4 transition-colors duration-150 ease-in-out"
            >
              <span className="bg-primary-subtle text-primary flex size-9 shrink-0 items-center justify-center rounded-full [&_svg]:size-4">
                {item.icon}
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-content text-sm font-medium">{item.title}</p>
                <p className="text-content-muted text-xs">{item.meta}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
