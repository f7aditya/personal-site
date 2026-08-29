import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";

const HEATMAP_DATA = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,1,2,2],[2,2,1,4,3,2,2],[2,1,4,1,4,1,4],[1,3,4,4,4,1,4],[4,2,4,2,2,2,1],[3,2,1,1,2,3,2],[1,1,1,3,1,2,2],[1,1,1,3,1,1,2],[4,1,4,1,1,1,1],[1,2,3,1,1,4,1],[2,1,1,2,3,4,4],[4,1,3,1,1,1,1],[1,1,3,4,4,1,1],[1,1,1,1,4,1,3],[1,2,1,1,1,4,1],[1,4,4,1,2,1,4],[4,4,1,3,4,4,4],[2,4,4,1,2,2,4],[4,0,2,1,1,1,4],[3,1,3,2,2,1,4],[1,1,1,1,1,1,1],[3,4,4,2,2,4,3],[4,4,1,4,1,0,4],[4,2,3,2,1,4,1],[1,1,2,0,3,1,1],[1,1,1,3,1,1,1],[1,1,3,1,1,3,1],[1,1,1,1,1,1,1],[2,1,1,3,2,1,3],[2,2,2,1,4,4,1],[1,2,1,3,1,0,1],[1,1,4,1,3,1,1],[4,4,4,4,4,3,4],[4,1,1,4,3,1,4]];
const MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

function cellColor(level) {
  return `var(--heatmap-${level > 4 ? 4 : level})`;
}

export default function Stats() {
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
          {/* Main metrics */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <FadeIn delay={0.1}>
              <a 
                href="https://leetcode.com/u/f7_adityaa/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="card p-8 flex-1 flex flex-col justify-center block hover:-translate-y-1 transition-transform"
              >
                <p className="text-[var(--fg-muted)] text-sm mb-2">LeetCode Rating</p>
                <p className="text-5xl font-bold text-[var(--accent)] mb-4">1,611</p>
                <div className="flex justify-between text-xs font-mono text-[var(--fg-dim)] border-t border-[var(--border)] pt-4">
                  <span>Top 22% Global</span>
                  <span>Max: 1,611</span>
                </div>
              </a>
            </FadeIn>

            <FadeIn delay={0.2} className="card p-8 flex-1 flex flex-col justify-center">
              <p className="text-[var(--fg-muted)] text-sm mb-4">Problem Distribution</p>
              <div className="space-y-4">
                {[
                  { label: "Easy", count: 201, pct: "36%", color: "#34d399" },
                  { label: "Medium", count: 285, pct: "52%", color: "#fbbf24" },
                  { label: "Hard", count: 65, pct: "12%", color: "#f87171" },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[var(--fg-muted)]">{d.label}</span>
                      <span className="font-mono">{d.count}</span>
                    </div>
                    <div className="h-1.5 bg-[var(--surface-2)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: d.pct }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Heatmap & Platforms */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <FadeIn delay={0.3} className="card p-8 flex-1 overflow-x-auto">
              <div className="flex justify-between items-end mb-8 min-w-[600px]">
                <div>
                  <h3 className="font-bold text-lg mb-1">Activity Map</h3>
                  <p className="text-sm text-[var(--fg-muted)]">550+ problems solved in the last year</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--fg-dim)]">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((n) => (
                    <div key={n} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cellColor(n) }} />
                  ))}
                  <span>More</span>
                </div>
              </div>

              <div className="min-w-[600px]">
                <div className="flex mb-2 ml-6 text-xs text-[var(--fg-dim)]">
                  {MONTHS.map((m) => (
                    <div key={m} className="flex-1 text-center">{m}</div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {HEATMAP_DATA.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1 flex-1">
                      {week.map((val, di) => (
                        <div
                          key={di}
                          className="w-full aspect-square rounded-sm"
                          style={{ backgroundColor: cellColor(val) }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.4} className="grid grid-cols-2 gap-8">
              <a 
                href="https://codeforces.com/profile/f7_adityaa"
                target="_blank"
                rel="noopener noreferrer"
                className="card p-6 flex items-center justify-between group block hover:-translate-y-1 transition-transform"
              >
                <div>
                  <p className="font-bold">Codeforces</p>
                  <p className="text-sm text-[var(--fg-muted)]">Expert · 1610</p>
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
                  <p className="text-sm text-[var(--fg-muted)]">1★ · 854</p>
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
