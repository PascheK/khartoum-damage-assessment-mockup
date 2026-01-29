"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KhartoumStoryMap from "@/components/KhartoumStoryMap";
import { PrePostMenu } from "@/components/PrePostMenu";
import { Container } from "@/components/layout/container";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Slider } from "@/components/ui/slider";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { BeforeAfterCompare } from "@/components/BeforeAfterCompare";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";

export default function Page() {
  const storyPinRef = useRef<HTMLDivElement | null>(null);
  const storyVisualRef = useRef<HTMLDivElement | null>(null);

  const [phase, setPhase] = useState<"pre" | "post">("pre");

  const handlePhaseChange = (next: "pre" | "post") => {
    setPhase(next);
    const targetId = next === "pre" ? "pre-conflict" : "post-conflict";
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const pinEl = storyPinRef.current;
    const visualEl = storyVisualRef.current;
    if (!pinEl || !visualEl) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Keep the Mapbox visual element at a constant (large) size and animate scale only.
      // This avoids tile reload/flicker from width/height animations.
      gsap.set(visualEl, {
        scale: 0.8, // 60vh / 90vh ≈ 0.666
        borderRadius: 16,
        boxShadow: "0 0px 0px rgba(0,0,0,0)",
        willChange: "transform",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: "+=200%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Zoom IN
      tl.to(
        visualEl,
        {
          scale: 1,
          borderRadius: 28,
          boxShadow: "0 30px 90px rgba(0,0,0,0.25)",
          ease: "none",
        },
        0,
      );

      // Zoom OUT
      tl.to(
        visualEl,
        {
          scale: 0.8,
          borderRadius: 16,
          boxShadow: "0 0px 0px rgba(0,0,0,0)",
          ease: "none",
        },
        0.65,
      );
    }, pinEl);

    return () => ctx.revert();
  }, []);

  // Synchronise le menu avec la section visible (pre/post)
  useEffect(() => {
    const preSection = document.getElementById("pre-conflict");
    const postSection = document.getElementById("post-conflict");
    if (!preSection || !postSection) return;

    let ticking = false;
    // Fonction utilitaire pour détecter la section visible
    const syncPhaseWithScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const preRect = preSection.getBoundingClientRect();
        const postRect = postSection.getBoundingClientRect();
        const vh = window.innerHeight;
        // On considère la section la plus visible (milieu de l'écran)
        const preVisible = preRect.top < vh / 2 && preRect.bottom > vh / 2;
        const postVisible = postRect.top < vh / 2 && postRect.bottom > vh / 2;
        if (preVisible && phase !== "pre") {
          setPhase("pre");
        } else if (postVisible && phase !== "post") {
          setPhase("post");
        }
        ticking = false;
      });
    };

    // IntersectionObserver pour synchro automatique (scroll naturel)
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id === "pre-conflict" && phase !== "pre") {
            setPhase("pre");
          } else if (entry.target.id === "post-conflict" && phase !== "post") {
            setPhase("post");
          }
        }
      });
    };
    const observer = new window.IntersectionObserver(handleIntersect, {
      root: null,
      threshold: 0.5, // 50% visible
    });
    observer.observe(preSection);
    observer.observe(postSection);

    // Ajoute un écouteur scroll pour forcer la synchro après scrollIntoView
    window.addEventListener("scroll", syncPhaseWithScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", syncPhaseWithScroll);
    };
  }, [phase]);

  // DATA FOR CHARTS
  const damagedBuildings = [
    { category: "Education", damaged: 225, undamaged: 2608 },
    { category: "Health", damaged: 144, undamaged: 1528 },
    { category: "Power", damaged: 13, undamaged: 57 },
    { category: "Waste", damaged: 0, undamaged: 1 },
    { category: "Water", damaged: 7, undamaged: 104 },
  ];

  const buildingsByCategory = [
    {
      category: "Education",
      damaged: 225,
      undamaged: 389,
      fill: "var(--chart-1)",
    },
    {
      category: "Health",
      damaged: 144,
      undamaged: 389,
      fill: "var(--chart-2)",
    },
    { category: "Power", damaged: 13, undamaged: 389, fill: "var(--chart-3)" },
    { category: "Waste", damaged: 0, undamaged: 389, fill: "var(--chart-4)" },
    { category: "Water", damaged: 7, undamaged: 389, fill: "var(--chart-5)" },
  ];

  const chartConfig = {
    damaged: {
      label: "Damaged",
      color: "var(--chart-1)",
    },
    undamaged: {
      label: "Undamaged",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  return (
    <>
      {/* Landing (PDF: Title + Subtitle + Paragraph + bottom menu) */}
      <section
        id="top"
        className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Damage Assessment in Conflict Environments
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600">
            Khartoum, Sudan | 2023 to 2025
          </p>

          <div className="mt-10 space-y-4 text-gray-700">
            <p className="text-lg font-semibold">
              GIS for Post Conflict and Disaster Recovery Planning
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Leveraging geospatial intelligence for comprehensive post-crisis
              response and rebuilding efforts.
            </p>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              A transparent, open-source analysis of the impact of armed
              conflicts on buildings in Khartoum, Sudan — from establishing a
              pre-conflict baseline to leading reconstruction efforts with
              confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Section 1 — Pre-conflict: Establishing the baseline */}
      <section id="pre-conflict" className="py-20">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Section 1 · Pre-conflict
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                Establishing the Baseline
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Knowing what was at stake
              </p>
              <p className="mt-6 text-gray-700 leading-relaxed">
                Before you can calculate loss, you must understand the value of
                what existed. Reconstruction doesn't start when the dust
                settles; it starts with understanding the community as it was.
                We begin by creating a digital inventory of the area, using open
                building footprint datasets and satellite imagery — mapping
                schools, hospitals, power plants, and any critical
                infrastructure identified by the community. This catalog serves
                as the foundation for every decision that follows.
              </p>
            </div>
          </div>
        </Container>

        {/* Pre-conflict content blocks: statistics + partnerships */}
        <Container>
          <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Scale
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">
                256,123
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Buildings analysed
              </div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Critical
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">4,687</div>
              <div className="mt-1 text-sm text-gray-600">
                Critical infrastructures identified
              </div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Partnerships
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Collaborating with academics and partners ensures reliable data
                and knowledge exchange on the most appropriate analysis
                processes.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-400" />
                  Humanitarian OpenStreetMap Team
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-400" />
                  Yale University
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-400" />
                  Oregon State University
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-400" />
                  Kent State University
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-400" />
                  UNMAS
                </li>
              </ul>
            </div>
          </div>
        </Container>

        {/* Pre-conflict content blocks: critical buildings chart */}
        <Container>
          <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Critical buildings identified
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Before conflict strikes, we rely on open-source data to
                understand what&apos;s at risk. Using building footprints and
                open-source data, we can classify critical infrastructure.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <ChartContainer config={chartConfig}>
                  <BarChart accessibilityLayer data={damagedBuildings}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="category"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={true}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("en-US", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)
                      }
                    />
                    <ChartTooltip cursor={false} content={DamageTooltip} />
                    <Bar dataKey="damaged" fill="var(--chart-1)"></Bar>
                    <Bar dataKey="undamaged" fill="var(--chart-2)"></Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 2a — Post-conflict: Assessing the damage */}
      <section id="post-conflict" className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Section 2a · Post-conflict
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                Post-conflict: Assessing the damage
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Eyes on the Ground, from Above
              </p>
              <p className="mt-6 text-gray-700 leading-relaxed">
                Sending teams on-the-ground to collect data about damaged
                infrastructures can be challenging, especially in large areas
                such as urban environments. With remote sensing data, we provide
                a 'watchtower' view, tracking damages remotely. Using the power
                of AI, we can help assess what changed, where and to what
                extent. Here are concrete examples of visible damages to
                critical infrastructures identified through geospatial
                intelligence.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8">
              {/* Controls placeholder */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Satellite imagery of hospital
                </h3>
                <div className="mt-6">
                  <BeforeAfterCompare
                    afterSrc="/images/hospital_before.jpg"
                    beforeSrc="/images/hospital_after.jpg"
                    beforeLabel="2023"
                    afterLabel="2025"
                    alt="Satellite imagery comparison"
                  />
                </div>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8">
              {/* Controls placeholder */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Satellite imagery of school
                </h3>
                <div className="mt-6">
                  <BeforeAfterCompare
                    afterSrc="/images/school_before.jpg"
                    beforeSrc="/images/school_after.jpg"
                    beforeLabel="2023"
                    afterLabel="2025"
                    alt="Satellite imagery comparison"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 2b — Post-conflict: Recovery planning */}
      <section id="recovery-planning" className="py-20">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Section 2b · Post-conflict
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                Post-conflict: Recovery Planning
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Counting the cost and planning the future
              </p>
              <p className="mt-6 text-gray-700 leading-relaxed">
                By visualizing critical damaged infrastructures, prioritization
                and recovery of essential services become possible. In Khartoum,
                out of the 4687 critical infrastructures identified, 389 were
                identified as damaged through remote analysis. AI-assisted
                analysis helps focus the attention and facilitates the
                identification of urgent reconstruction needs. Teams can then go
                on the ground to confirm the damages and provide expert
                recommendations for interventions.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Critical
                </div>
                <div className="mt-2 text-3xl font-bold text-gray-900">389</div>
                <div className="mt-1 text-sm text-gray-600">
                  infrastructure damaged
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Damaged buildings by category
                </h3>
                <ChartContainer config={chartConfig}>
                  <PieChart>
                    <ChartTooltip content={DamageTooltip} />
                    <Pie
                      data={buildingsByCategory}
                      dataKey="damaged"
                      label
                      nameKey="category"
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
            {/* Story Map (pinned + zoom) */}
            <div
              ref={storyPinRef}
              className="mt-10 min-h-screen flex items-center justify-center px-4"
            >
              {/* Layout frame keeps page flow stable */}
              <div className="relative w-full max-w-6xl h-[60vh] max-h-[700px]">
                {/* Centered host (doesn't affect layout) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  {/* Visual element stays big; GSAP animates its scale */}
                  <div
                    ref={storyVisualRef}
                    className="w-[90vw] h-[90vh] rounded-2xl overflow-hidden bg-gray-200"
                  >
                    <KhartoumStoryMap />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-black/10 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Khartoum Damage Assessment</p>
            <p className="text-xs">
              Methodology / sources / credits — placeholder
            </p>
          </div>
        </Container>
      </footer>
      <PrePostMenu value={phase} onChange={handlePhaseChange} />
    </>
  );
}

export function DamageTooltip(props: TooltipContentProps<ValueType, NameType>) {
  const { active, payload } = props as TooltipContentProps<ValueType, NameType>;
  if (!active || !payload?.length) return null;

  const p = payload[0].payload as {
    category: string;
    damaged: number;
    undamaged: number;
  };

  const ratio = calculateDamageRatio(p.damaged, p.undamaged);

  return (
    <div className="rounded-lg border bg-foreground p-2 text-sm shadow">
      <div className="font-medium text-white">{p.category}</div>
      <div className="mt-2 font-semibold text-white">
        {p.damaged} ({(ratio * 100).toFixed(1)}%)
      </div>
    </div>
  );
}

function calculateDamageRatio(damaged: number, total: number) {
  if (total === 0) return 0;
  return damaged / total;
}
