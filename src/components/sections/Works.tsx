"use client";

import Image from "next/image";
import { useState } from "react";
import { Container, Panel, SectionLabel } from "@/components/ui";
import { works, type WorkTile } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Tələbə işləri — tünd panel üzərində mozaika.
 * Referans: design/landing-reference.html → `<!-- STUDENT WORKS: mosaic -->`.
 *
 * Plitələr hələ placeholder-dir (CLAUDE.md → Açıq qalanlar): real şəkillər
 * gələndə rəngli/zolaqlı fonlar `next/image` ilə əvəz olunacaq.
 */

const fillClass: Record<NonNullable<WorkTile["fill"]>, string> = {
  yellow: "bg-yellow",
  pink: "bg-pink",
  cobalt: "bg-cobalt",
  indigo: "bg-indigo",
  lime: "bg-lime",
  ink: "bg-ink",
  paper: "bg-paper",
  stripe:
    "bg-[repeating-linear-gradient(135deg,#d9d4ca_0_2px,#e6e2da_2px_14px)]",
};

/**
 * 12 sütunlu grid-də plitənin eni. Tailwind şablonla sinif qura bilmədiyi
 * üçün açıq xəritə. ≤900px: geniş plitələr tam en, kiçiklər yarı
 * (referansdakı `.s12` / `.s6m`).
 */
const spanClass: Record<number, string> = {
  3: "col-span-3 max-[900px]:col-span-6",
  5: "col-span-5 max-[900px]:col-span-12",
  6: "col-span-6 max-[900px]:col-span-12",
  7: "col-span-7 max-[900px]:col-span-12",
};

/**
 * Placeholder plitələrin dekorativ formaları.
 * Real şəkil əlavə olunanda bunlar göstərilmir.
 */
function TileDecoration({ kind }: { kind: WorkTile["placeholder"] }) {
  if (kind === "poster") {
    return (
      <>
        <div
          aria-hidden="true"
          className="text-ink absolute top-[8%] left-[6%] text-[clamp(64px,9vw,150px)] leading-[0.82] font-semibold tracking-[-0.065em]"
        >
          Bakı
          <br />
          Dizayn
          <br />
          Həftəsi
        </div>
        <div
          aria-hidden="true"
          className="bg-cobalt rounded-pill absolute right-[6%] bottom-[10%] aspect-square w-[30%]"
        />
      </>
    );
  }

  if (kind === "logo") {
    return (
      <>
        <div
          aria-hidden="true"
          className="border-paper rounded-pill absolute inset-[20%] border-2"
        />
        <div
          aria-hidden="true"
          className="bg-paper rounded-pill absolute inset-[36%]"
        />
      </>
    );
  }

  if (kind === "motion") {
    return (
      <div
        aria-hidden="true"
        className="absolute top-[22%] right-[12%] left-[12%] flex flex-col gap-2.5"
      >
        <span className="bg-lime h-3.5 w-4/5 rounded-[4px]" />
        <span className="h-3.5 w-[55%] rounded-[4px] bg-white/70" />
        <span className="h-3.5 w-[68%] rounded-[4px] bg-white/40" />
      </div>
    );
  }

  return null;
}

/**
 * Filter düymələri plitələrdən törəyir: hansı teqlər varsa, o düymələr görünür.
 * Tək teq varsa filter ümumiyyətlə göstərilmir — "Hamısı" və "Qrafik" eyni
 * nəticəni versəydi, bu, heç nə etməyən kontrol olardı.
 * Motion işləri əlavə olunan kimi filter özü peyda olur.
 */
const tagsInUse = [...new Set(works.tiles.map((tile) => tile.tag))];
const filters = [works.allFilter, ...tagsInUse];
const showFilters = tagsInUse.length > 1;

export function Works() {
  const [filter, setFilter] = useState<string>(works.allFilter);

  const visible = works.tiles.filter(
    (tile) => filter === works.allFilter || tile.tag === filter,
  );

  return (
    <Panel
      id={works.id}
      tone="ink"
      className="scroll-mt-[90px] pt-[clamp(48px,6vw,88px)] pb-2"
    >
      <Container className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-[18px]">
          <SectionLabel number="03" tone="lime">
            Tələbə işləri
          </SectionLabel>
          <h2 className="text-web-h2-m lg:text-web-h2 text-paper m-0">
            <span className="text-web-text-soft">{works.headingSoft}</span>{" "}
            {works.heading}
          </h2>
        </div>

        <div
          role="group"
          aria-label={works.filterLabel}
          hidden={!showFilters}
          className="rounded-pill flex gap-0.5 bg-white/8 p-1"
        >
          {filters.map((name) => {
            const active = name === filter;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(name)}
                className={cn(
                  "rounded-pill h-9 cursor-pointer border-0 px-4 text-sm font-semibold transition-colors",
                  active
                    ? "bg-paper text-ink"
                    : "text-paper bg-transparent hover:bg-white/10",
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </Container>

      <div className="grid grid-cols-12 gap-web-mosaic-gap px-2">
        {visible.map((tile) => {
          return (
            <figure
              key={tile.caption}
              className={cn(
                "rounded-mosaic relative m-0 overflow-hidden",
                tile.size === "lg"
                  ? "h-[clamp(280px,30vw,440px)]"
                  : "h-[clamp(200px,20vw,280px)]",
                // Fon yalnız şəkil olmayanda görünür
                !tile.image && tile.fill && fillClass[tile.fill],
                spanClass[tile.span],
              )}
            >
              {tile.image ? (
                <Image
                  src={tile.image}
                  // Ad lövhəsi ilə eyni mətn: "İş adı — Tələbə adı"
                  alt={tile.caption}
                  fill
                  sizes={
                    tile.span >= 6
                      ? "(max-width: 900px) 100vw, 60vw"
                      : "(max-width: 900px) 50vw, 30vw"
                  }
                  className="object-cover"
                  style={{ objectPosition: tile.imagePosition }}
                />
              ) : (
                <TileDecoration kind={tile.placeholder} />
              )}
              <figcaption
                className={cn(
                  "rounded-pill absolute bottom-2.5 left-2.5 inline-flex h-[30px] items-center px-3 text-xs font-semibold",
                  tile.captionGlass === "light"
                    ? "glass text-ink"
                    : "glass-dark text-paper",
                )}
              >
                {tile.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Panel>
  );
}
