import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const NAV = [
  { label: "Home",    href: "#home"     },
  { label: "About",   href: "#about"    },
  { label: "Skills",  href: "#skills"   },
  { label: "Work",    href: "#projects" },
  { label: "Stats",   href: "#stats"    },
  { label: "Resume",  href: "#resume"   },
  { label: "Contact", href: "#contact"  },
];

const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.3 }
    );
    document.querySelectorAll("section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "var(--bg)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          opacity: scrolled ? 0.95 : 1,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => go("#home")}
            className="text-sm font-bold tracking-tight"
            style={{ color: "var(--fg)" }}
          >
            <span style={{ color: "var(--accent)" }}>✦</span> Aditya
          </button>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <button
                  key={link.href}
                  onClick={() => go(link.href)}
                  className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150"
                  style={{ color: isActive ? "var(--accent)" : "var(--fg-muted)" }}
                  onMouseEnter={(e) => !isActive && (e.currentTarget.style.color = "var(--fg)")}
                  onMouseLeave={(e) => !isActive && (e.currentTarget.style.color = "var(--fg-muted)")}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors duration-150 hover:bg-[var(--surface-2)]"
              style={{ color: "var(--fg-muted)" }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <motion.button
              onClick={() => go("#contact")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="btn-primary text-xs py-2.5 px-5"
            >
              Hire Me ✦
            </motion.button>
          </div>

          {/* Hamburger & Mobile Theme Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors duration-150"
              style={{ color: "var(--fg-muted)" }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 flex flex-col gap-1.5"
              aria-label="menu"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={
                    open
                      ? i === 1
                        ? { opacity: 0, scale: 0 }
                        : { rotate: i === 0 ? 45 : -45, y: i === 0 ? 7 : -7 }
                      : { rotate: 0, y: 0, opacity: 1 }
                  }
                  className="block h-px rounded-full origin-center"
                  style={{
                    backgroundColor: "var(--fg)",
                    width: i === 1 ? "1.25rem" : "1.5rem",
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2"
            style={{ background: "var(--bg)", backdropFilter: "blur(24px)", opacity: 0.98 }}
          >
            {NAV.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { setOpen(false); go(link.href); }}
                className="text-2xl font-bold py-2.5 transition-colors duration-150"
                style={{ color: active === link.href.slice(1) ? "var(--accent)" : "var(--fg-muted)" }}
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              onClick={() => { setOpen(false); go("#contact"); }}
              className="btn-primary mt-6"
            >
              Hire Me ✦
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
