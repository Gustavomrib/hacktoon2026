import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Topbar } from "@/components/app-shell/topbar";
import { ProfileMain } from "@/components/profile/profile-main";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";

export default function Home() {
  return (
    <main className="bg-canvas min-h-dvh px-4 py-8 lg:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="bg-surface shadow-lg overflow-hidden rounded-2xl">
          <Topbar />
          <div className="grid lg:grid-cols-[19rem_1fr]">
            <ProfileSidebar />
            <ProfileMain />
          </div>
        </div>

        <Link
          href="/design-system"
          className="text-content-onbrand hover:text-white mx-auto flex items-center gap-2 text-sm font-medium transition-colors duration-150 ease-in-out"
        >
          Ver a documentação do design system
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  );
}
