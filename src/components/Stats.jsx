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
    // Dark mode: pure greyscale with high contrast
    level0: isDark ? "#222222" : "#EBEDF0", // very distinct empty block
    level1: isDark ? "#555555" : "#9BE9A8", // 1 sub
    level2: isDark ? "#888888" : "#40C463", // 2-3 subs
    level3: isDark ? "#BBBBBB" : "#30A14E", // 4-6 subs
    level4: isDark ? "#FFFFFF" : "#216E39", // 7+ subs
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

  // Group heatmap data by month to render separate calendars
  const monthsData = [];
  if (d.heatmap && d.heatmap.length > 0) {
    const groups = {};
    d.heatmap.forEach(day => {
      const month = day.date.substring(0, 7); // "YYYY-MM"
      if (!groups[month]) groups[month] = [];
      groups[month].push(day);
    });
    Object.keys(groups).sort().forEach(k => monthsData.push(groups[k]));
  }

  // Stars string
  const starStr = cc.stars ? "★".repeat(cc.stars) + "☆".repeat(Math.max(0, 7 - cc.stars)) : "1★";

  return (
    <section id="stats" className="min-h-[calc(100vh-68px)] flex flex-col py-8 relative">
      <div className="max-w-6xl mx-auto px-6 w-full my-auto">
        <FadeIn className="mb-16">
          <p className="section-label">Metrics</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Consistent <span className="gradient-text">growth.</span>
          </h2>
        </FadeIn>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* ── Left column ─────────────────────────────────────────── */}
          <div className="lg:col-span-4 flex flex-col gap-8 min-w-0">

            {/* LeetCode Rating card */}
            <FadeIn delay={0.1}>
              <a
                href="https://leetcode.com/u/f7_adityaa/"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-8 flex flex-col justify-center block hover:-translate-y-1 transition-transform overflow-hidden"
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
            <FadeIn delay={0.2} className="card p-8 flex flex-col justify-center overflow-hidden">
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
          <div className="lg:col-span-8 flex flex-col gap-8 min-w-0">

            {/* Activity Map card */}
            <FadeIn delay={0.3} className="card p-5 sm:p-8 flex-1 overflow-hidden min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-6">
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
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                  <div className="flex gap-2 sm:gap-3 min-w-max">
                    {monthsData.map((monthData, i) => {
                      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      const dateParts = monthData[0].date.split("-");
                      const mIdx = parseInt(dateParts[1], 10) - 1;
                      const mName = monthNames[mIdx];
                      
                      return (
                        <div key={i} className="flex flex-col gap-2">
                          <span className="text-[10px] text-[var(--fg-muted)] pl-1">{mName}</span>
                          <ActivityCalendar
                            data={monthData}
                            theme={calTheme}
                            colorScheme={isDark ? "dark" : "light"}
                            blockSize={9}
                            blockMargin={2}
                            blockRadius={2}
                            fontSize={10}
                            showColorLegend={false}
                            showTotalCount={false}
                            showWeekdayLabels={i === 0}
                            showMonthLabels={false}
                            labels={{
                              weekdays: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
                            }}
                            style={{ color: colors.text }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--fg-dim)]">No activity data available.</p>
              )}
            </FadeIn>

            {/* Platform cards */}
            <FadeIn delay={0.4} className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
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
