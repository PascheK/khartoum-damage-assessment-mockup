"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KhartoumStoryMap from "@/components/KhartoumStoryMap";
import { PrePostMenu } from "@/components/PrePostMenu";
import { Container } from "@/components/layout/container";

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
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Keep the Mapbox visual element at a constant (large) size and animate scale only.
      // This avoids tile reload/flicker from width/height animations.
      gsap.set(visualEl, {
        scale: 0.67, // 60vh / 90vh ≈ 0.666
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
        0
      );

      // Zoom OUT
      tl.to(
        visualEl,
        {
          scale: 0.67,
          borderRadius: 16,
          boxShadow: "0 0px 0px rgba(0,0,0,0)",
          ease: "none",
        },
        0.65
      );
    }, pinEl);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Landing (PDF: Title + Subtitle + Paragraph + bottom menu) */}
      <section
        id="top"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4"
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
                <KhartoumStoryMap phase={phase} />
              </div>
            </div>
          </div>
        </div>

        {/* Pre-conflict content blocks: charts + partnerships */}
        <Container>
          <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Charts placeholder */}
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Critical buildings identified
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Before conflict strikes, we rely on open-source data to
                understand what's at risk. Using building footprints and
                open-source data, we can classify critical infrastructure.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="rounded-xl bg-gray-50 border border-black/5 h-40 flex items-center justify-center text-sm text-gray-500">
                  Histogram (damaged + undamaged) — placeholder
                </div>
                <div className="rounded-xl bg-gray-50 border border-black/5 h-40 flex items-center justify-center text-sm text-gray-500">
                  Chart: all buildings by category — placeholder
                </div>
              </div>
            </div>

            {/* Partnerships */}
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
                extent.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls placeholder */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Interactivity
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Zoom to Hospital and School. Show before/after satellite
                  imagery.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="px-4 py-2 rounded-full text-sm font-semibold border border-black/10 bg-white hover:bg-gray-50">
                    Zoom to Hospital
                  </button>
                  <button className="px-4 py-2 rounded-full text-sm font-semibold border border-black/10 bg-white hover:bg-gray-50">
                    Zoom to School
                  </button>
                </div>

                <div className="mt-6 rounded-xl bg-gray-50 border border-black/5 h-44 flex items-center justify-center text-sm text-gray-500">
                  Before/After comparison slider — placeholder
                </div>
              </div>

              {/* Imagery placeholders */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">
                  Satellite imagery
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Use two frames (before / after) or a draggable divider.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 border border-black/5 h-44 flex items-center justify-center text-sm text-gray-500">
                    Before — placeholder
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-black/5 h-44 flex items-center justify-center text-sm text-gray-500">
                    After — placeholder
                  </div>
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
                nearly 250’000 buildings were analysed, and around 6000 of them
                were categorised as critical infrastructure. AI-assisted
                analysis helps focus the attention on key areas and
                infrastructures. Urgent reconstruction needs become easily
                identifiable. Teams can then go on the ground to confirm the
                damages and provide expert recommendations for interventions.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Scale
                </div>
                <div className="mt-2 text-3xl font-bold text-gray-900">
                  ~250’000
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Buildings analysed
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Critical
                </div>
                <div className="mt-2 text-3xl font-bold text-gray-900">
                  ~6’000
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Critical infrastructure
                </div>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Interactivity
                </div>
                <div className="mt-4 rounded-xl bg-gray-50 border border-black/5 h-24 flex items-center justify-center text-sm text-gray-500">
                  Export / actions — placeholder
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Damaged buildings by category
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Pie chart — placeholder
              </p>
              <div className="mt-6 rounded-xl bg-gray-50 border border-black/5 h-56 flex items-center justify-center text-sm text-gray-500">
                Pie chart (damaged by category) — placeholder
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
