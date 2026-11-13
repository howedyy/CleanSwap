"use client";

import { Star, ShieldCheck, ArrowRight, BadgeCheck, Sparkles, HardHat, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/section";
import { useQuote } from "@/components/quote/quote-provider";
import { SITE } from "@/lib/site";

export function Hero() {
  const { requestQuote } = useQuote();

  return (
    <section id="home" className="relative overflow-hidden bg-linear-to-b from-teal-50/40 via-white/50 to-surface/60 backdrop-blur-xs pt-20 pb-20 sm:pt-28 sm:pb-28 relative z-10">
      {/* Background ambient luxury gradient rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-linear-to-tr from-teal-500/10 via-amber-400/5 to-transparent rounded-full blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-7">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal y={20}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-xs ring-1 ring-amber-500/20">
                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                Reliable • Professional • Family Run
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-900/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/30 shadow-xs">
                <Sparkles className="size-3 text-amber-400 animate-spin" />
                Awakened Sanctuary • Suffolk, Cambridgeshire &amp; Cambridge
              </div>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-[3.8rem] lg:leading-[1.12]">
              Professional Cleaning &amp;
              <span className="block bg-linear-to-r from-teal-700 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                Property Services
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.1} y={20}>
            <p className="mt-6 text-lg text-slate-600 sm:text-xl leading-relaxed">
              A trusted family-run business providing cleaning and property support services to residential and commercial clients across Suffolk, Cambridgeshire, and Cambridge. High standards, flexible scheduling, and competitive pricing.
            </p>
          </Reveal>

          <Reveal delay={0.15} y={20}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" className="group px-7" onClick={() => requestQuote("General No-Obligation Quotation")}>
                Get a Free Quote
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button asChild size="lg" variant="outline" className="px-7">
                <a href="#services">View Services &amp; Pricing</a>
              </Button>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-brand transition-colors"
              >
                <Phone className="size-4 text-brand" />
                {SITE.phoneDisplay}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2} y={20}>
            <div className="mt-10 flex flex-wrap justify-center gap-3.5 items-center">
              <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 shadow-xs ring-1 ring-slate-200 hover:ring-amber-400/40 transition-all">
                <div className="flex -space-x-0.5 text-amber-500">
                  <Star className="size-4 fill-current" />
                  <Star className="size-4 fill-current" />
                  <Star className="size-4 fill-current" />
                  <Star className="size-4 fill-current" />
                  <Star className="size-4 fill-current" />
                </div>
                <span className="text-xs font-semibold text-ink">5-Star Client Feedback</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 shadow-xs ring-1 ring-slate-200 hover:ring-teal-400/50 transition-all">
                <ShieldCheck className="size-4 text-teal-600" />
                <span className="text-xs font-semibold text-ink">Public Liability Insured (£5M)</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 shadow-xs ring-1 ring-slate-200 hover:ring-teal-400/50 transition-all">
                <BadgeCheck className="size-4 text-teal-600" />
                <span className="text-xs font-semibold text-ink">COSHH &amp; H&amp;S Practices</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 shadow-xs ring-1 ring-slate-200 hover:ring-amber-400/40 transition-all">
                <HardHat className="size-4 text-amber-600" />
                <span className="text-xs font-semibold text-ink">Certified Confined Space</span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 shadow-xs ring-1 ring-slate-200 hover:ring-amber-400/40 transition-all">
                <span className="size-2 rounded-full bg-teal-500" />
                <span className="text-xs font-semibold text-ink">Commercial &amp; Residential</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
