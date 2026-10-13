import Image from "next/image";
import { Button, GlassCard, Panel, Pill, SectionLabel } from "@/components/ui";
import { community } from "@/content/site";

/**
 * Community — split panel: lime mətn paneli + foto paneli (şüşə elementlərlə).
 * Referans: design/landing-reference.html → `<!-- COMMUNITY -->`.
 */
export function Community() {
  return (
    <section
      id={community.id}
      className="grid scroll-mt-[90px] grid-cols-1 gap-web-frame min-[900px]:grid-cols-12"
    >
      <Panel
        as="div"
        tone="lime"
        className="min-[900px]:col-span-5 flex min-h-[560px] flex-col gap-[22px] p-[clamp(32px,4vw,56px)]"
      >
        <SectionLabel number="06" tone="ink">
          Community
        </SectionLabel>

        <h2 className="text-web-h2-m lg:text-web-h2 m-0">
          {community.headingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>

        <p className="m-0 max-w-[440px] text-[clamp(17px,1.4vw,19px)] leading-[1.55] font-medium">
          {community.text}
        </p>

        <div className="mt-auto flex flex-wrap gap-2.5">
          <Button href={community.joinCta.href} variant="dark" arrow>
            {community.joinCta.label}
          </Button>
          <Button href={community.instagramCta.href} variant="outline">
            {community.instagramCta.label}
          </Button>
        </div>
      </Panel>

      <Panel as="div" tone="ink" className="min-[900px]:col-span-7 min-h-[560px]">
        <Image
          src={community.photo.src}
          alt={community.photo.alt}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
          style={{ objectPosition: community.photo.position }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,18,40,0)_45%,rgba(21,18,40,0.55)_100%)]"
        />

        <span className="absolute top-4 left-4">
          <Pill variant="glass">{community.photo.badge}</Pill>
        </span>

        {/* Kiçik foto — ≤900px-də gizlənir */}
        <GlassCard
          as="figure"
          radius="mosaic"
          className="absolute top-4 right-4 m-0 hidden w-[168px] rounded-[22px] p-1.5 min-[900px]:block"
        >
          {/* `fill` + ölçülü sarğı: en/hündürlük nisbətini CSS pozmur,
              yoxsa next/image "aspect ratio" xəbərdarlığı verir. */}
          <div className="rounded-mosaic relative h-[200px] w-full overflow-hidden">
            <Image
              src={community.photoInset.src}
              alt={community.photoInset.alt}
              fill
              sizes="168px"
              className="object-cover"
              style={{ objectPosition: community.photoInset.position }}
            />
          </div>
        </GlassCard>

        <GlassCard
          as="article"
          radius="xl-m"
          className="absolute right-3.5 bottom-3.5 left-3.5 ml-auto flex max-w-[440px] flex-col gap-3 p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <Pill variant="ink" dot>
              {community.event.badge}
            </Pill>
            <span className="font-display text-lg font-semibold">
              {community.event.date}
            </span>
          </div>

          <h3 className="m-0 text-[26px] leading-[1.08] font-semibold tracking-[-0.035em]">
            {community.event.title}
          </h3>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold">
              {community.event.meta}
            </span>
            <Button href={community.event.cta.href} size="sm" arrow>
              {community.event.cta.label}
            </Button>
          </div>
        </GlassCard>
      </Panel>
    </section>
  );
}
