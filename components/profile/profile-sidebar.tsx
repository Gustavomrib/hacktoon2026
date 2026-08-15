import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/data-list";

const workplaces = [
  {
    name: "Spotify New York",
    tag: "Primary",
    variant: "brand" as const,
    address: ["170 William Street", "New York, NY 10038-78 212-312-51"],
  },
  {
    name: "Metropolitan Museum",
    tag: "Secondary",
    variant: "neutral" as const,
    address: ["525 E 68th Street", "New York, NY 10651-78 156-187-60"],
  },
];

const skills = [
  "Branding",
  "UI/UX",
  "Web — Design",
  "Packaging",
  "Print & Editorial",
];

export function ProfileSidebar() {
  return (
    <aside className="border-border flex flex-col gap-6 p-6 lg:border-r lg:p-8">
      <Image
        src="/portrait.svg"
        alt="Jeremy Rose"
        width={320}
        height={340}
        priority
        className="bg-surface-inset aspect-[16/17] w-full rounded-md object-cover"
      />

      <section className="flex flex-col gap-4">
        <SectionLabel>Work</SectionLabel>
        {workplaces.map((place) => (
          <div key={place.name} className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-semibold">{place.name}</h4>
              <Badge variant={place.variant}>{place.tag}</Badge>
            </div>
            <p className="text-content-muted text-sm">
              {place.address[0]}
              <br />
              {place.address[1]}
            </p>
          </div>
        ))}
      </section>

      <section className="border-border flex flex-col gap-3 border-t pt-6">
        <SectionLabel>Skills</SectionLabel>
        <ul className="flex flex-col gap-1.5">
          {skills.map((skill) => (
            <li key={skill} className="text-content text-sm">
              {skill}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
