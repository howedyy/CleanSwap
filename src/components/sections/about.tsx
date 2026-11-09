"use client";

import { ShieldCheck, HeartHandshake, CalendarClock, Sparkles, ReceiptText, ThumbsUp } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/section";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Card3D, Pop3D } from "@/components/ui/card-3d";

const WHY_CHOOSE_US = [
  {
    icon: HeartHandshake,
    title: "Family-Run Business",
    description: "A trusted family team offering friendly, personal attention, care, and genuine dedication to every client.",
  },
  {
    icon: Sparkles,
    title: "High Cleaning Standards",
    description: "Rigorous attention to detail, spotless finishes, and consistent five-star standards on every visit.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Scheduling",
    description: "We adapt timing and frequency to suit your routine, commercial shifts, or urgent last-minute requirements.",
  },
  {
    icon: ShieldCheck,
    title: "Commercial & Specialist Credentials",
    description: "Certified confined space entry, full Public Liability insurance coverage (£5M), strict COSHH compliance, and rigorous health-and-safety practices.",
  },
  {
    icon: ReceiptText,
    title: "Bespoke & Transparent Pricing",
    description: "Clear, competitive pricing with bespoke quotations and free, no-obligation quotes for every project.",
  },
  {
    icon: ThumbsUp,
    title: "Reliable & Trustworthy",
    description: "Loyal, dependable cleaners who go above and beyond, backed by stellar client reviews and multi-year partnerships.",
  },
];

const METRICS = [
  { value: 100, suffix: "%", label: "Public Liability Insured & COSHH Compliant" },
  { value: 5, suffix: ".0 ★", label: "Consistent Five-Star Customer Rating" },
  { value: 3, suffix: "+ Years", label: "Trusted Commercial & Residential Partnerships" },
];

export function About() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white/70 backdrop-blur-md relative z-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-7">
        <SectionHeading
          eyebrow="About Clean Sweep Oasis"
          title="A trusted family-run business delivering exceptional property support."
          description="We provide comprehensive cleaning and property support services to residential and commercial clients across Suffolk, Cambridgeshire, and Cambridge, with high standards, friendly service, and total reliability."
        />

        {/* 6 Core Pillars with 3D Depth */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_US.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} y={20}>
              <Card3D depth={10} className="rounded-2xl">
                <div className="group flex flex-col h-full p-6 sm:p-7 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 hover:border-amber-400/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl group-hover:bg-amber-400/10 transition-colors pointer-events-none" />
                  <Pop3D z={35} className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 shadow-xs ring-1 ring-teal-200/60 group-hover:bg-amber-50 group-hover:text-amber-600 group-hover:ring-amber-300/80 transition-all">
                    <item.icon className="size-6" />
                  </Pop3D>
                  <Pop3D z={20}>
                    <h3 className="font-display text-lg font-bold text-slate-900 group-hover:text-teal-900 transition-colors">{item.title}</h3>
                  </Pop3D>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </Card3D>
            </Reveal>
          ))}
        </div>

        {/* Slide 8: Our Commitment Callout */}
        <Reveal delay={0.2} y={20} className="mt-12">
          <div className="rounded-3xl bg-linear-to-br from-teal-900/5 via-teal-50/50 to-amber-50/40 p-8 sm:p-10 border border-teal-200/60 shadow-xs relative overflow-hidden">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Our Sanctuary Commitment</span>
              <blockquote className="mt-3 font-display text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                “We are committed to delivering dependable cleaning services with attention to detail, professionalism and customer satisfaction in every job we undertake.”
              </blockquote>
              <p className="mt-4 text-sm font-semibold text-amber-700 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-amber-500" />
                Clean Sweep Oasis LTD Team
              </p>
            </div>
          </div>
        </Reveal>

        {/* Metrics Row */}
        <div className="mt-16 rounded-3xl bg-slate-950 py-12 px-6 sm:px-12 sm:py-16 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-2 bg-linear-to-r from-transparent via-amber-400/80 to-transparent" />
          <div className="grid gap-8 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {METRICS.map((metric, i) => (
              <Reveal key={metric.label} delay={i * 0.1} y={20} className="flex flex-col items-center text-center pt-8 sm:pt-0 first:pt-0">
                <div className="font-display text-4xl sm:text-5xl font-bold text-white flex items-center justify-center">
                  <AnimatedNumber value={metric.value} format={(n) => String(n)} />
                  <span className="text-amber-400">{metric.suffix}</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-300 max-w-xs">{metric.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
