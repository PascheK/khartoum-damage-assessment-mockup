"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import KhartoumStoryMap from "@/components/KhartoumStoryMap";
import { Container } from "@/components/layout/container";

export default function Page() {
  const storyPinRef = useRef<HTMLDivElement | null>(null);
  const storyVisualRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const pinEl = storyPinRef.current;
    const visualEl = storyVisualRef.current;
    if (!pinEl || !visualEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // We keep the visual element at a constant (large) size and animate only scale.
      // This avoids Mapbox constantly reloading tiles during width/height changes.
      gsap.set(visualEl, {
        scale: 0.67, // 60vh / 90vh ≈ 0.666
        borderRadius: 16,
        boxShadow: "0 0px 0px rgba(0,0,0,0)",
        willChange: "transform",
      });

      // Zoom IN -> Zoom OUT pendant que c’est pin
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: "+=200%", // distance de scroll pendant laquelle on joue l’animation
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

      // Zoom OUT (pour “sortir” et continuer l’histoire)
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
      {/* Hero */}
      <section
        id="top"
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4"
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Khartoum Damage Assessment
            </h1>
            <p className="text-xl text-gray-600">
              Explore conflict impact through interactive story mapping
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#story"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Start story
            </a>
            <a
              href="#next"
              className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors inline-block"
            >
              Skip
            </a>
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="py-20">
        <Container>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Story Map (3D)</h2>
            <p className="text-sm text-gray-600 mt-2">
              Scroll on the map: zoom in → keep scrolling: zoom out → continue.
            </p>
          </div>
        </Container>

        {/* Pin zone */}
        <div
          ref={storyPinRef}
          className="mt-8 min-h-screen flex items-center justify-center px-4"
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
      </section>

      {/* Next section (placeholder) */}
      <section id="next" className="py-24 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900">Next section</h2>
            <p className="mt-3 text-gray-600">
              Ici, on mettra la suite de l’histoire (textes, charts, etc.).
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}