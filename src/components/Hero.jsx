import { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { FadeIn } from "./FadeIn";

const go = (href) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

export default function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMove = (e) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const bg = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, var(--accent-glow), transparent 80%)`;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Interactive mouse glow */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none hidden md:block" style={{ background: bg }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
        
        {/* Text Content */}
        <div className="text-left order-2 md:order-1">
          <FadeIn delay={0.1}>
            <div className="badge mb-6 md:mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Available for hire
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5 md:mb-6">
              Building systems that <span className="gradient-text italic">scale, perform &amp; matter.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-base sm:text-lg md:text-xl text-[var(--fg-muted)] mb-8 md:mb-10 leading-relaxed font-light">
              Full-stack engineer and competitive programmer building high-performance web applications, scalable backends, and AI-powered products.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button onClick={() => go("#projects")} className="btn-primary w-full sm:w-auto justify-center">
                View Work
              </button>
              <button onClick={() => go("#contact")} className="btn-ghost w-full sm:w-auto justify-center">
                Contact Me
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Image / Avatar */}
        <FadeIn delay={0.5} className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative w-56 h-56 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] rounded-full md:rounded-3xl overflow-hidden border border-[var(--border)] shadow-2xl">
            <img 
              src="/profile-light.jpg" 
              alt="Aditya (Light Mode)" 
              className="object-cover w-full h-full light-img"
            />
            <img 
              src="/profile-dark.jpg" 
              alt="Aditya (Dark Mode)" 
              className="object-cover w-full h-full dark-img"
            />
            {/* Optional tint overlay to blend image with theme */}
            <div className="absolute inset-0 bg-[var(--accent)] mix-blend-overlay opacity-10" />
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
