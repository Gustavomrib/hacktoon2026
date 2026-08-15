import Link from "next/link";
import { Droplet, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { CountBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const navigation = [
  { label: "Find people", href: "/" },
  { label: "Messages", href: "/", count: 4 },
  { label: "My Contacts", href: "/" },
];

export function Topbar() {
  return (
    <header className="border-border flex flex-wrap items-center gap-4 border-b px-6 py-4 lg:gap-8 lg:px-8">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="bg-primary flex size-8 items-center justify-center rounded-full">
          <Droplet className="size-4 fill-white text-white" />
        </span>
        <span className="font-display text-content text-xl font-semibold tracking-tight">
          Kodecolor
        </span>
      </Link>

      <div className="order-3 w-full sm:order-none sm:w-auto sm:max-w-xs sm:flex-1">
        <Input
          type="search"
          placeholder="Search"
          aria-label="Search"
          icon={<Search />}
        />
      </div>

      <nav className="ml-auto flex items-center gap-6">
        <ul className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-content-secondary hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors duration-150 ease-in-out"
              >
                {item.label}
                {item.count ? <CountBadge>{item.count}</CountBadge> : null}
              </Link>
            </li>
          ))}
        </ul>
        <Avatar src="/avatar.svg" name="Jeremy Rose" status="online" size="md" />
      </nav>
    </header>
  );
}
