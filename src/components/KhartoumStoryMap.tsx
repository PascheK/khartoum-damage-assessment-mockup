"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const TILESET_URL = "mapbox://paschek7.khartoum_buildings_v1";
const SOURCE_ID = "khartoum";
const SOURCE_LAYER = "buildings";
const LAYER_ID = "khartoum-3d";
const OUTLINE_ID = `${LAYER_ID}-outline`;
const SELECT_ID = `${LAYER_ID}-selected`;

type Step = {
  id: string;
  title: string;
  body: string;
  camera: {
    center: [number, number];
    zoom: number;
    pitch?: number;
    bearing?: number;
    durationMs?: number;
  };
  actions?: {
    mode?: "pre" | "post";
    categories?: string[]; // ex: ["education","health"]
    statuses?: string[]; // ex: ["damaged"]
    heightScale?: number; // ex: 1.2
    outlineDamaged?: boolean; // show/hide outline
    popup?: { title: string; body: string };
  };
};

function buildFilter(categories?: string[], statuses?: string[]) {
  const clauses: any[] = ["all"];

  if (categories?.length) {
    clauses.push(["in", ["get", "tor_category"], ["literal", categories]]);
  }

  if (statuses?.length) {
    clauses.push(["in", ["get", "status"], ["literal", statuses]]);
  }

  // If only ["all"], it means no filter
  return clauses.length === 1 ? null : clauses;
}

export default function KhartoumStoryMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const hoveredIdRef = useRef<number | string | null>(null);
  const selectedIdRef = useRef<number | string | null>(null);

  const [ready, setReady] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [exploreMode, setExploreMode] = useState(false);

  const [toast, setToast] = useState<{ title: string; body: string } | null>(
    null
  );
  const [inspect, setInspect] = useState<{
    title: string;
    lines: string[];
  } | null>(null);

  const steps: Step[] = useMemo(
    () => [
      {
        id: "baseline",
        title: "Establishing the baseline",
        body: "Overview of the built environment. Use Next/Previous to follow the story.",
        camera: {
          center: [32.55, 15.51666667],
          zoom: 16.8,
          pitch: 55,
          bearing: -15,
          durationMs: 1500,
        },
        actions: {
          mode: "pre",
          categories: undefined,
          statuses: undefined,
          heightScale: 1,
          outlineDamaged: false,
          popup: {
            title: "Step 1 · Baseline",
            body: "We start with a broad view before focusing on specific infrastructure.",
          },
        },
      },
      {
        id: "categories",
        title: "Critical infrastructure categories",
        body: "Highlight key categories (education, health, water, power…). This is a baseline classification.",
        camera: {
          center: [32.55, 15.51666667],
          zoom: 17.3,
          pitch: 60,
          bearing: 20,
          durationMs: 1500,
        },
        actions: {
          mode: "pre",
          categories: ["education", "health", "water", "power"],
          statuses: undefined,
          heightScale: 1,
          outlineDamaged: false,
          popup: {
            title: "Step 2 · Categories",
            body: "We filter the map to focus on critical infrastructure categories.",
          },
        },
      },
      {
        id: "damage-overview",
        title: "Assessing damage (overview)",
        body: "Switch to a post-conflict lens. Damaged features are emphasized for quick scanning.",
        camera: {
          center: [32.55, 15.51666667],
          zoom: 17.0,
          pitch: 60,
          bearing: -35,
          durationMs: 1700,
        },
        actions: {
          mode: "post",
          categories: undefined,
          statuses: ["damaged"],
          heightScale: 1.2,
          outlineDamaged: true,
          popup: {
            title: "Step 3 · Damage overview",
            body: "Damaged buildings are filtered and outlined to support rapid assessment.",
          },
        },
      },
      {
        id: "hospital",
        title: "Case focus: Hospital",
        body: "Zoom into a health facility area. Click buildings to inspect attributes.",
        camera: {
          center: [32.5532, 15.5159],
          zoom: 18.6,
          pitch: 65,
          bearing: 10,
          durationMs: 1700,
        },
        actions: {
          mode: "post",
          categories: ["health"],
          statuses: ["damaged", "undamaged", "unknown"],
          heightScale: 1.25,
          outlineDamaged: true,
          popup: {
            title: "Step 4 · Hospital focus",
            body: "We focus on health infrastructure for situational awareness.",
          },
        },
      },
      {
        id: "school",
        title: "Case focus: School",
        body: "Zoom into an education facility area. Height scale can be used as emphasis for storytelling.",
        camera: {
          center: [32.5489, 15.5182],
          zoom: 18.5,
          pitch: 65,
          bearing: -20,
          durationMs: 1700,
        },
        actions: {
          mode: "post",
          categories: ["education"],
          statuses: ["damaged", "undamaged", "unknown"],
          heightScale: 1.35,
          outlineDamaged: true,
          popup: {
            title: "Step 5 · School focus",
            body: "Education sites can be spotlighted for recovery planning priorities.",
          },
        },
      },
      {
        id: "recovery-planning",
        title: "Recovery planning",
        body: "Return to a broader view to support reconstruction planning and prioritization.",
        camera: {
          center: [32.55, 15.51666667],
          zoom: 16.9,
          pitch: 55,
          bearing: 25,
          durationMs: 1700,
        },
        actions: {
          mode: "post",
          categories: ["health", "education", "water", "power"],
          statuses: undefined,
          heightScale: 1.1,
          outlineDamaged: true,
          popup: {
            title: "Step 6 · Recovery planning",
            body: "Broader overview helps compare categories and identify priority clusters.",
          },
        },
      },
      {
        id: "explore",
        title: "Explore mode",
        body: "You can now explore freely. Use the toggle to lock back into story mode anytime.",
        camera: {
          center: [32.55, 15.51666667],
          zoom: 17.2,
          pitch: 58,
          bearing: 0,
          durationMs: 1200,
        },
        actions: {
          mode: "post",
          categories: undefined,
          statuses: undefined,
          heightScale: 1,
          outlineDamaged: true,
          popup: {
            title: "Step 7 · Explore",
            body: "Story steps are finished—feel free to inspect buildings and navigate freely.",
          },
        },
      },
    ],
    []
  );

  const currentStep = steps[stepIndex];

  const applyStep = useCallback(
    (idx: number) => {
      const map = mapRef.current;
      if (!map) return;

      const s = steps[idx];

      // Camera
      map.flyTo({
        center: s.camera.center,
        zoom: s.camera.zoom,
        pitch: s.camera.pitch ?? map.getPitch(),
        bearing: s.camera.bearing ?? map.getBearing(),
        duration: s.camera.durationMs ?? 1400,
        essential: true,
      });

      // Actions: filters, heights, outline, toast
      const heightScale = s.actions?.heightScale ?? 1;
      const filter = buildFilter(s.actions?.categories, s.actions?.statuses);

      if (map.getLayer(LAYER_ID)) {
        map.setFilter(LAYER_ID, filter);
        map.setPaintProperty(LAYER_ID, "fill-extrusion-height", [
          "*",
          ["to-number", ["coalesce", ["get", "height"], 0]],
          heightScale,
        ]);
      }

      if (map.getLayer(OUTLINE_ID)) {
        // Outline shows only damaged (and optionally category filter)
        const outlineBase: any[] = [
          "all",
          ["==", ["get", "status"], "damaged"],
        ];
        if (s.actions?.categories?.length) {
          outlineBase.push([
            "in",
            ["get", "tor_category"],
            ["literal", s.actions.categories],
          ]);
        }
        map.setFilter(OUTLINE_ID, outlineBase);
        map.setLayoutProperty(
          OUTLINE_ID,
          "visibility",
          s.actions?.outlineDamaged ? "visible" : "none"
        );
      }

      // Step popup (UI toast)
      if (s.actions?.popup) setToast(s.actions.popup);
      else setToast(null);

      // Clear inspect on step change (optional)
      setInspect(null);
    },
    [steps]
  );

  // Init Mapbox
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    if (!mapboxgl.accessToken) {
      console.error("Missing NEXT_PUBLIC_MAPBOX_TOKEN");
      return;
    }

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard-satellite",
      config: {
        basemap: {
          showPedestrianRoads: false,
          show3dObjects: true,
          showPlaceLabels: false,
          showPointOfInterestLabels: false,
          showRoadLabels: false,
          showTransitLabels: false,
          showAdminBoundaries: false,
          showLandmarkIconLabels: false,
        },
      },
      zoom: 18,
      center: [32.55, 15.51666667],
      pitch: 60,
      antialias: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      // Source
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: "vector",
          url: TILESET_URL,
        });
      }

      // 3D layer
      if (!map.getLayer(LAYER_ID)) {
        map.addLayer({
          id: LAYER_ID,
          type: "fill-extrusion",
          source: SOURCE_ID,
          "source-layer": SOURCE_LAYER,
          minzoom: 13,
          paint: {
            "fill-extrusion-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "#95a5a6",
              [
                "match",
                ["get", "tor_category"],

                // building
                "building",
                [
                  "match",
                  ["get", "status"],
                  "damaged",
                  "#ff2f00",
                  "undamaged",
                  "#ffffff",
                  "unknown",
                  "#ededed",
                  "#ededed",
                ],

                // education
                "education",
                [
                  "match",
                  ["get", "status"],
                  "damaged",
                  "#00a83c",
                  "undamaged",
                  "#00d24d",
                  "#00d24d",
                ],

                // health
                "health",
                [
                  "match",
                  ["get", "status"],
                  "damaged",
                  "#ff7f00",
                  "undamaged",
                  "#ffd200",
                  "#ffd200",
                ],

                // power
                "power",
                [
                  "match",
                  ["get", "status"],
                  "damaged",
                  "#ff9900",
                  "undamaged",
                  "#ffd640",
                  "#ffd640",
                ],

                // waste
                "waste",
                "#b0724f",

                // water
                "water",
                [
                  "match",
                  ["get", "status"],
                  "damaged",
                  "#00b7ff",
                  "undamaged",
                  "#0099ff",
                  "#0099ff",
                ],

                /* default */ "#95a5a6",
              ],
            ],
            "fill-extrusion-height": [
              "*",
              ["to-number", ["coalesce", ["get", "height"], 0]],
              1,
            ],
            "fill-extrusion-base": 0,
            "fill-extrusion-opacity": 0.85,
          },
        });
      }

      // Damaged outline
      if (!map.getLayer(OUTLINE_ID)) {
        map.addLayer({
          id: OUTLINE_ID,
          type: "line",
          source: SOURCE_ID,
          "source-layer": SOURCE_LAYER,
          filter: ["==", ["get", "status"], "damaged"],
          paint: {
            "line-color": "#ff2f00",
            "line-width": 3,
            "line-opacity": 1,
          },
        });
      }

      // Selected highlight layer (optional, uses feature id)
      if (!map.getLayer(SELECT_ID)) {
        map.addLayer({
          id: SELECT_ID,
          type: "line",
          source: SOURCE_ID,
          "source-layer": SOURCE_LAYER,
          filter: ["==", ["id"], -1],
          paint: {
            "line-color": "#ffffff",
            "line-width": 4,
            "line-opacity": 1,
          },
        });
      }

      // Hover interactions
      map.on("mousemove", LAYER_ID, (e) => {
        map.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0];
        const id = (f?.id ?? null) as number | string | null;

        // remove previous hover
        if (hoveredIdRef.current != null) {
          try {
            map.setFeatureState(
              {
                source: SOURCE_ID,
                sourceLayer: SOURCE_LAYER,
                id: hoveredIdRef.current as any,
              },
              { hover: false }
            );
          } catch {}
        }

        hoveredIdRef.current = id;

        if (id != null) {
          try {
            map.setFeatureState(
              { source: SOURCE_ID, sourceLayer: SOURCE_LAYER, id: id as any },
              { hover: true }
            );
          } catch {}
        }
      });

      map.on("mouseleave", LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
        if (hoveredIdRef.current != null) {
          try {
            map.setFeatureState(
              {
                source: SOURCE_ID,
                sourceLayer: SOURCE_LAYER,
                id: hoveredIdRef.current as any,
              },
              { hover: false }
            );
          } catch {}
        }
        hoveredIdRef.current = null;
      });

      // Click inspect
      map.on("click", LAYER_ID, (e) => {
        const f = e.features?.[0];
        if (!f) return;

        const id = (f.id ?? null) as number | string | null;
        selectedIdRef.current = id;

        // Highlight selected
        if (map.getLayer(SELECT_ID) && id != null) {
          map.setFilter(SELECT_ID, ["==", ["id"], id as any]);
        } else if (map.getLayer(SELECT_ID)) {
          map.setFilter(SELECT_ID, ["==", ["id"], -1]);
        }

        const cat = (f.properties?.tor_category ?? "unknown") as string;
        const status = (f.properties?.status ?? "unknown") as string;
        const height =
          f.properties?.height != null ? String(f.properties.height) : "n/a";

        setInspect({
          title: "Building details",
          lines: [`Category: ${cat}`, `Status: ${status}`, `Height: ${height}`],
        });
      });

      setReady(true);

      // Apply initial step after layers exist
      setTimeout(() => applyStep(0), 0);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [applyStep]);

  // Step changes
  useEffect(() => {
    if (!ready) return;
    if (exploreMode) return; // don't force camera when exploring
    applyStep(stepIndex);
  }, [applyStep, exploreMode, ready, stepIndex]);

  // Keyboard navigation (← / →)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setStepIndex((i) => Math.min(i + 1, steps.length - 1));
        setExploreMode(false);
      }
      if (e.key === "ArrowLeft") {
        setStepIndex((i) => Math.max(i - 1, 0));
        setExploreMode(false);
      }
      if (e.key === "Escape") {
        setToast(null);
        setInspect(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steps.length]);

  // Keep Mapbox sized correctly when the container resizes (GSAP zoom / fullscreen)
  useEffect(() => {
    const map = mapRef.current;
    const el = containerRef.current;
    if (!map || !el) return;

    const resize = () => {
      try {
        map.resize();
      } catch {}
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);

    window.addEventListener("resize", resize);
    document.addEventListener("fullscreenchange", resize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("fullscreenchange", resize);
    };
  }, []);

  const goPrev = () => {
    setExploreMode(false);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const goNext = () => {
    setExploreMode(false);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const resetSelection = () => {
    const map = mapRef.current;
    selectedIdRef.current = null;
    if (map?.getLayer(SELECT_ID)) map.setFilter(SELECT_ID, ["==", ["id"], -1]);
    setInspect(null);
  };

  const toggleFullscreen = async () => {
    const el = wrapperRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      // ignore
    }
  };

  const modeLabel =
    currentStep.actions?.mode === "post" ? "Post-conflict" : "Pre-conflict";

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full overflow-hidden rounded-l-2xl bg-gray-200"
    >
      {/* Map viewport */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Top bar (minimal) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-black/10 text-xs font-medium">
          {modeLabel} · Step {stepIndex + 1}/{steps.length}
        </div>

        <button
          onClick={() => setExploreMode((v) => !v)}
          className="px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-black/10 text-xs font-medium hover:bg-white"
          title="Toggle explore mode"
        >
          {exploreMode ? "Resume story" : "Explore"}
        </button>

        <button
          onClick={resetSelection}
          className="px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-black/10 text-xs font-medium hover:bg-white"
          title="Clear selection"
        >
          Clear
        </button>
      </div>

      {/* Fullscreen button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-black/10 text-xs font-medium hover:bg-white"
      >
        Fullscreen
      </button>

      {/* Right narrative panel (minimal, no component abstraction) */}
      <div className="absolute right-4 top-16 z-20 w-[320px] max-w-[85vw] hidden md:block">
        <div className="rounded-2xl bg-white/85 backdrop-blur border border-black/10 shadow-sm p-4">
          <div className="text-xs uppercase tracking-wide text-black/60">
            Story
          </div>
          <div className="mt-1 text-base font-semibold">
            {currentStep.title}
          </div>
          <p className="mt-2 text-sm text-black/80 leading-relaxed">
            {currentStep.body}
          </p>

          {inspect && (
            <div className="mt-4 border-t border-black/10 pt-3">
              <div className="text-sm font-semibold">{inspect.title}</div>
              <ul className="mt-2 text-sm text-black/80 space-y-1">
                {inspect.lines.map((l) => (
                  <li key={l} className="font-mono text-[12px]">
                    {l}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setInspect(null)}
                className="mt-3 text-xs font-medium underline text-black/70 hover:text-black"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast popup (step popup) */}
      {toast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-[520px] max-w-[92vw]">
          <div className="rounded-2xl bg-white/90 backdrop-blur border border-black/10 shadow-sm px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{toast.title}</div>
                <div className="text-sm text-black/80 mt-1">{toast.body}</div>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-xs px-2 py-1 rounded-full border border-black/10 bg-white/60 hover:bg-white"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom-center story controls (discreet/minimal) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-2 px-2 py-2 rounded-full bg-white/75 backdrop-blur border border-black/10 shadow-sm">
          <button
            onClick={goPrev}
            disabled={stepIndex === 0}
            className="px-3 py-1 rounded-full text-xs font-medium border border-black/10 bg-white/60 hover:bg-white disabled:opacity-40 disabled:hover:bg-white/60"
          >
            Prev
          </button>

          {/* dots */}
          <div className="flex items-center gap-1 px-2">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  setExploreMode(false);
                  setStepIndex(i);
                }}
                className={[
                  "h-2 w-2 rounded-full border border-black/20",
                  i === stepIndex
                    ? "bg-black/70"
                    : "bg-white/60 hover:bg-white",
                ].join(" ")}
                title={`Go to ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={stepIndex === steps.length - 1}
            className="px-3 py-1 rounded-full text-xs font-medium border border-black/10 bg-white/60 hover:bg-white disabled:opacity-40 disabled:hover:bg-white/60"
          >
            Next
          </button>
        </div>

        {/* Mobile inspect panel (only when something selected) */}
        {inspect && (
          <div className="md:hidden mt-3 w-[92vw] max-w-[520px]">
            <div className="rounded-2xl bg-white/85 backdrop-blur border border-black/10 shadow-sm p-4">
              <div className="text-sm font-semibold">{inspect.title}</div>
              <ul className="mt-2 text-sm text-black/80 space-y-1">
                {inspect.lines.map((l) => (
                  <li key={l} className="font-mono text-[12px]">
                    {l}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setInspect(null)}
                className="mt-3 text-xs font-medium underline text-black/70 hover:text-black"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Small “loading” hint if token missing / not ready */}
      {!mapboxgl.accessToken && (
        <div className="absolute inset-0 z-40 flex items-center justify-center">
          <div className="rounded-xl bg-white/90 border border-black/10 px-4 py-3 text-sm">
            Missing <span className="font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</span>
          </div>
        </div>
      )}
    </div>
  );
}
