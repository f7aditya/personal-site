import * as cheerio from "cheerio";

// ─── 6-hour in-memory cache ───────────────────────────────────────────────────
const CACHE_TTL = 6 * 60 * 60 * 1000;
let cache = null;
let cacheTs = 0;

const LC_HANDLE = "f7_adityaa";
const CF_HANDLE = "f7_adityaa";
const CC_HANDLE = "f7_aditya";

// ─── LeetCode (GraphQL) ───────────────────────────────────────────────────────
async function fetchLeetCode() {
  const query = `
    query getUserData($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
        userCalendar {
          submissionCalendar
        }
      }
      userContestRanking(username: $username) {
        rating
        topPercentage
        attendedContestsCount
      }
    }
  `;

  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({ query, variables: { username: LC_HANDLE } }),
  });

  if (!res.ok) throw new Error(`LeetCode GraphQL error: ${res.status}`);
  const { data } = await res.json();

  const stats = data?.matchedUser?.submitStats?.acSubmissionNum ?? [];
  const easy = stats.find((s) => s.difficulty === "Easy")?.count ?? 0;
  const medium = stats.find((s) => s.difficulty === "Medium")?.count ?? 0;
  const hard = stats.find((s) => s.difficulty === "Hard")?.count ?? 0;

  const calRaw = data?.matchedUser?.userCalendar?.submissionCalendar ?? "{}";
  const calendar = JSON.parse(calRaw);

  const contest = data?.userContestRanking;
  const rating = Math.round(contest?.rating ?? 0);
  const topPct = contest?.topPercentage ?? null;

  return { rating, topPct, easy, medium, hard, calendar };
}

// ─── Codeforces (REST) ────────────────────────────────────────────────────────
async function fetchCodeforces() {
  const [infoRes, statusRes] = await Promise.all([
    fetch(`https://codeforces.com/api/user.info?handles=${CF_HANDLE}`),
    fetch(`https://codeforces.com/api/user.status?handle=${CF_HANDLE}&count=1000`),
  ]);

  if (!infoRes.ok) throw new Error(`CF info error: ${infoRes.status}`);
  const infoData = await infoRes.json();
  const user = infoData?.result?.[0] ?? {};

  const rating = user.rating ?? 0;
  const maxRating = user.maxRating ?? 0;
  const rank = user.rank ?? "unranked";

  const calendar = {};
  if (statusRes.ok) {
    const statusData = await statusRes.json();
    for (const sub of statusData?.result ?? []) {
      if (sub.verdict === "OK") {
        const day = Math.floor(sub.creationTimeSeconds / 86400) * 86400;
        calendar[day] = (calendar[day] ?? 0) + 1;
      }
    }
  }

  return { rating, maxRating, rank, calendar };
}

// ─── CodeChef (HTML scrape) ───────────────────────────────────────────────────
async function fetchCodeChef() {
  try {
    const res = await fetch(`https://www.codechef.com/users/${CC_HANDLE}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) throw new Error(`CodeChef fetch error: ${res.status}`);
    const html = await res.text();
    cheerio.load(html);

    const ratings = [];
    html.replace(/"rating":"(\d+)"/g, (_, r) => ratings.push(parseInt(r)));
    const currentRating = ratings.length ? ratings[ratings.length - 1] : 0;

    const starMatch = html.match(/(\d)&#9733;/);
    const stars = starMatch ? parseInt(starMatch[1]) : 1;

    return { rating: currentRating, stars };
  } catch {
    return { rating: 854, stars: 1 };
  }
}

// ─── Heatmap Merge ────────────────────────────────────────────────────────────
function buildHeatmap(lcCalendar, cfCalendar) {
  const merged = {};

  for (const [ts, cnt] of Object.entries(lcCalendar)) {
    const day = Math.floor(parseInt(ts) / 86400) * 86400;
    merged[day] = (merged[day] ?? 0) + cnt;
  }
  for (const [ts, cnt] of Object.entries(cfCalendar)) {
    const day = parseInt(ts);
    merged[day] = (merged[day] ?? 0) + cnt;
  }

  const today = new Date();
  // Use UTC to prevent timezone shifts when calling toISOString()
  const utcToday = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  
  const startDate = new Date(utcToday);
  startDate.setUTCFullYear(startDate.getUTCFullYear() - 1);
  startDate.setUTCDate(startDate.getUTCDate() + 1);

  const result = [];
  for (let d = new Date(startDate); d <= utcToday; d.setUTCDate(d.getUTCDate() + 1)) {
    const unixDay = Math.floor(d.getTime() / 1000); // Already at UTC midnight
    const dateStr = d.toISOString().split("T")[0];
    result.push({ date: dateStr, count: merged[unixDay] ?? 0, level: 0 });
  }

  for (const r of result) {
    if (r.count === 0) r.level = 0;       // lightest
    else if (r.count <= 2) r.level = 2;   // medium
    else if (r.count <= 6) r.level = 3;   // dark
    else r.level = 4;                     // darkest
  }

  return result;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (cache && Date.now() - cacheTs < CACHE_TTL) {
    return res.status(200).json({ ...cache, cached: true });
  }

  try {
    const [lc, cf, cc] = await Promise.allSettled([
      fetchLeetCode(),
      fetchCodeforces(),
      fetchCodeChef(),
    ]);

    const lcData = lc.status === "fulfilled" ? lc.value
      : { rating: 1611, topPct: 22.77, easy: 201, medium: 285, hard: 65, calendar: {} };
    const cfData = cf.status === "fulfilled" ? cf.value
      : { rating: 1610, maxRating: 1660, rank: "expert", calendar: {} };
    const ccData = cc.status === "fulfilled" ? cc.value : { rating: 854, stars: 1 };

    const heatmap = buildHeatmap(lcData.calendar, cfData.calendar);
    const totalActive = heatmap.filter((d) => d.count > 0).length;

    const payload = {
      leetcode: {
        rating: lcData.rating,
        topPct: lcData.topPct,
        easy: lcData.easy,
        medium: lcData.medium,
        hard: lcData.hard,
      },
      codeforces: {
        rating: cfData.rating,
        maxRating: cfData.maxRating,
        rank: cfData.rank,
      },
      codechef: {
        rating: ccData.rating,
        stars: ccData.stars,
      },
      heatmap,
      totalActive,
      fetchedAt: new Date().toISOString(),
    };

    cache = payload;
    cacheTs = Date.now();

    return res.status(200).json({ ...payload, cached: false });
  } catch (err) {
    console.error("Metrics error:", err);
    return res.status(500).json({ error: "Failed to fetch metrics." });
  }
}
