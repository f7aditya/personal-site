import { useState, useEffect, useRef } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { HEATMAP_FALLBACK } from "../data/heatmapFallback";

// ─── Fallback static data (shown while loading or on error) ──────────────────
const FALLBACK = {
  leetcode: { rating: 1611, topPct: 22.77, easy: 201, medium: 285, hard: 65 },
  codeforces: { rating: 1610, maxRating: 1660, rank: "expert" },
  codechef: { rating: 854, stars: 1 },
  heatmap: HEATMAP_FALLBACK,
  totalActive: 346,
};

// ─── Skeleton shimmer block ───────────────────────────────────────────────────
function Skeleton({ className = "" }) {
  return (
    <div
      className={`bg-[var(--surface-2)] rounded-lg animate-pulse ${className}`}
    />
  );
}

// ─── Animated progress bar ────────────────────────────────────────────────────
function Bar({ pct, color }) {
  return (
    <div className="h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

// ─── Theme-aware colours — reads localStorage to avoid flash on refresh ───────
function useThemeColors() {
  const [isDark, setIsDark] = useState(() => {
    // Read localStorage first (same key the Navbar writes: "theme")
    // Falls back to checking the class in case it was set another way
    try {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
    } catch {}
    return document.documentElement.classList.contains("dark");
  });

  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return {
    isDark,
    level0: isDark ? "#1F1F1F" : "#D6E8D6",
    level1: isDark ? "#4A4A4A" : "#87B98E",
    level2: isDark ? "#808080" : "#4A8C5C",
    level3: isDark ? "#C0C0C0" : "#2A6640",
    level4: isDark ? "#FFFFFF" : "#135222",
    text:   isDark ? "#737373" : "#8F897E",
  };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Stats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasFetched = useRef(false);
  const colors = useThemeColors();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("/api/metrics")
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const d = data ?? FALLBACK;
  const lc = d.leetcode;
  const cf = d.codeforces;
  const cc = d.codechef;
  const totalSolved = (lc.easy ?? 0) + (lc.medium ?? 0) + (lc.hard ?? 0);
  const dist = [
    { label: "Easy", count: lc.easy, color: "#34d399" },
    { label: "Medium", count: lc.medium, color: "#fbbf24" },
    { label: "Hard", count: lc.hard, color: "#f87171" },
  ].map((item) => ({ ...item, pct: totalSolved ? (item.count / totalSolved) * 100 : 0 }));

  const { isDark } = colors;

  // react-activity-calendar theme — same scale for both keys, colorScheme selects which to use
  const calTheme = {
    light: [colors.level0, colors.level1, colors.level2, colors.level3, colors.level4],
    dark:  [colors.level0, colors.level1, colors.level2, colors.level3, colors.level4],
  };

  // Stars string
  const starStr = cc.stars ? "★".repeat(cc.stars) + "☆".repeat(Math.max(0, 7 - cc.stars)) : "1★";

  return (
    <section id="stats" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn className="mb-16">
          <p className="section-label">Metrics</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Consistent <span className="gradient-text">growth.</span>
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col gap-8">

            {/* LeetCode Rating card */}
            <FadeIn delay={0.1}>
              <a
                href="https://leetcode.com/u/f7_adityaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-8 flex flex-col justify-center block hover:-translate-y-1 transition-transform"
              >
                <p className="text-[var(--fg-muted)] text-sm mb-2">LeetCode Rating</p>
                {loading ? (
                  <Skeleton className="h-12 w-32 mb-4" />
                ) : (
                  <p className="text-5xl font-bold text-[var(--accent)] mb-4">
                    {lc.rating ? lc.rating.toLocaleString() : "—"}
                  </p>
                )}
                <div className="flex justify-between text-xs font-mono text-[var(--fg-dim)] border-t border-[var(--border)] pt-4">
                  {loading ? (
                    <>
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </>
                  ) : (
                    <>
                      <span>
                        {lc.topPct != null ? `Top ${lc.topPct.toFixed(0)}% Global` : "Contest Rated"}
                      </span>
                      <span>Max: {lc.rating?.toLocaleString()}</span>
                    </>
                  )}
                </div>
              </a>
            </FadeIn>

            {/* Problem Distribution card */}
            <FadeIn delay={0.2} className="card p-8 flex flex-col justify-center">
              <p className="text-[var(--fg-muted)] text-sm mb-4">Problem Distribution</p>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-3 w-full mb-1.5" />
                      <Skeleton className="h-1.5 w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {dist.map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[var(--fg-muted)]">{item.label}</span>
                        <span className="font-mono">{item.count}</span>
                      </div>
                      <Bar pct={item.pct} color={item.color} />
                    </div>
                  ))}
                </div>
              )}
            </FadeIn>
          </div>

          {/* ── Right column ─────────────────────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-8">

            {/* Activity Map card */}
            <FadeIn delay={0.3} className="card p-8 flex-1 overflow-hidden">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="font-bold text-lg mb-1">Activity Map</h3>
                  {loading ? (
                    <Skeleton className="h-3 w-48" />
                  ) : (
                    <p className="text-sm text-[var(--fg-muted)]">
                      {d.totalActive}+ active days in the last year
                      {error && " (offline data)"}
                    </p>
                  )}
                </div>
              </div>

              {loading ? (
                <Skeleton className="h-28 w-full" />
              ) : d.heatmap && d.heatmap.length > 0 ? (
                <div className="overflow-x-auto">
                  <ActivityCalendar
                    data={d.heatmap}
                    theme={calTheme}
                    colorScheme={isDark ? "dark" : "light"}
                    blockSize={11}
                    blockMargin={3}
                    blockRadius={2}
                    fontSize={11}
                    labels={{
                      legend: { less: "Less", more: "More" },
                      months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
                      weekdays: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
                      totalCount: "{{count}} activities in {{year}}",
                    }}
                    style={{ color: colors.text }}
                  />
                </div>
              ) : (
                <p className="text-sm text-[var(--fg-dim)]">No activity data available.</p>
              )}
            </FadeIn>

            {/* Platform cards */}
            <FadeIn delay={0.4} className="grid grid-cols-2 gap-8">
              <a
                href="https://codeforces.com/profile/f7_adityaa"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-6 flex items-center justify-between group block hover:-translate-y-1 transition-transform"
              >
                <div>
                  <p className="font-bold">Codeforces</p>
                  {loading ? (
                    <Skeleton className="h-3 w-24 mt-1" />
                  ) : (
                    <p className="text-sm text-[var(--fg-muted)] capitalize">
                      {cf.rank} · {cf.rating}
                    </p>
                  )}
                </div>
                <span className="text-[var(--border-focus)] group-hover:text-[var(--accent)] transition-colors">↗</span>
              </a>

              <a
                href="https://www.codechef.com/users/f7_aditya"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-6 flex items-center justify-between group block hover:-translate-y-1 transition-transform"
              >
                <div>
                  <p className="font-bold">CodeChef</p>
                  {loading ? (
                    <Skeleton className="h-3 w-20 mt-1" />
                  ) : (
                    <p className="text-sm text-[var(--fg-muted)]">
                      {cc.stars}★ · {cc.rating}
                    </p>
                  )}
                </div>
                <span className="text-[var(--border-focus)] group-hover:text-[var(--accent)] transition-colors">↗</span>
              </a>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
