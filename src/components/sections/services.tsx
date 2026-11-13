"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  HardHat,
  KeyRound,
  MapPin,
  Phone,
  Sparkles,
  SprayCan,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/section";
import { Card3D, Pop3D } from "@/components/ui/card-3d";
import { useQuote } from "@/components/quote/quote-provider";
import { SITE } from "@/lib/site";

interface ServicePackage {
  id: string;
  icon: LucideIcon;
  title: string;
  badge: string;
  priceText: string;
  priceSub: string;
  description: string;
  includes: string[];
  idealFor: string[];
  howPricingWorks: string;
  quoteSubject: string;
  actionLabel: string;
  accent: "teal" | "amber";
}

const SERVICES: ServicePackage[] = [
  {
    id: "commercial",
    icon: Building2,
    title: "Commercial Cleaning",
    badge: "Most Popular for Businesses",
    priceText: "From £25/hr",
    priceSub: "Offices & Commercial Premises",
    description: "Dependable, tailored cleaning schedules designed around your workplace operations.",
    includes: [
      "Offices & open-plan workspaces",
      "Retail premises & shop floors",
      "Communal areas & shared hallways",
      "Restroom sanitation & waste handling",
      "Flexible early morning / evening timing",
    ],
    idealFor: ["Offices & studios", "Shops & showrooms", "Residential blocks & communal areas", "Clinics, gyms & workshops"],
    howPricingWorks:
      "Priced from £25 per hour. The final price depends on the size of your premises, how often we visit and the hours that suit you. We confirm everything in a free, no-obligation quote.",
    quoteSubject: "Quote Request: Commercial Cleaning",
    actionLabel: "Request Commercial Quote",
    accent: "teal",
  },
  {
    id: "deep",
    icon: SprayCan,
    title: "Deep Cleaning",
    badge: "Family-Run Quality",
    priceText: "From £25/hr",
    priceSub: "One-off or recurring visits",
    description: "A thorough top-to-bottom clean for homes and properties that need more than a standard visit.",
    includes: [
      "Kitchens: hobs, extractors, cupboards & oven detailing",
      "Bathrooms: descaling, grout & tile scrub",
      "Skirting boards, doors, frames & switches",
      "Inside windows, sills & mirrors",
      "Dusting high & low, vacuuming & mopping throughout",
    ],
    idealFor: ["Seasonal or spring cleans", "Moving in or out", "Before or after events", "First clean before a regular schedule"],
    howPricingWorks:
      "Priced from £25 per hour. The time needed depends on the size and condition of the property, so we agree an estimate with you up front in a free quote. Recurring visits can be arranged afterwards.",
    quoteSubject: "Quote Request: Deep Cleaning",
    actionLabel: "Request Deep Clean Quote",
    accent: "teal",
  },
  {
    id: "confined",
    icon: HardHat,
    title: "Certified Confined Space",
    badge: "Accredited & High Risk",
    priceText: "Bespoke Quotation",
    priceSub: "RAMS & Site Assessment Included",
    description: "Certified entry operatives and specialist decontamination for tanks, vessels, silos, ducts, and shafts.",
    includes: [
      "City & Guilds certified entry specialists",
      "Multi-gas detectors & escape breathing apparatus",
      "Full RAMS, risk assessments & permits to work",
      "Silos, tanks, interceptors & ductwork",
      "Comprehensive post-clean certification",
    ],
    idealFor: ["Tanks, vessels & silos", "Grease interceptors & drains", "Ductwork & shafts", "Industrial & agricultural sites"],
    howPricingWorks:
      "Every confined space job is different, so each one is quoted individually after a site assessment. The quote includes the risk assessment and method statement (RAMS).",
    quoteSubject: "Quote Request: Certified Confined Space Cleaning",
    actionLabel: "Request Specialist Quote",
    accent: "amber",
  },
  {
    id: "tenancy",
    icon: KeyRound,
    title: "End of Tenancy Clean",
    badge: "Agency Checklist Standard",
    priceText: "From £150",
    priceSub: "Price depends on property size",
    description: "Thorough handover cleaning designed to secure full deposit returns without disputes.",
    includes: [
      "Intensive top-to-bottom scrub",
      "Inside cupboards, wardrobes & drawers",
      "Oven, cooker & appliance detailing",
      "Deep bathroom descaling & tiles",
      "Deposit return guarantee standard",
    ],
    idealFor: ["Tenants moving out", "Landlords between lets", "Letting agents", "Properties with an inventory checklist"],
    howPricingWorks:
      "Priced from £150 and based on the size of the property (bedrooms and bathrooms). Tell us the details and we'll confirm a fixed price in a free quote.",
    quoteSubject: "Quote Request: End of Tenancy Clean",
    actionLabel: "Request Tenancy Quote",
    accent: "amber",
  },
  {
    id: "specialist",
    icon: Sparkles,
    title: "Gardening, Windows & Odd Jobs",
    badge: "Tailored to Each Project",
    priceText: "Quoted Separately",
    priceSub: "Free no-obligation quotes",
    description: "Specialist equipment cleans and property maintenance for interior and exterior spaces.",
    includes: [
      "Carpet deep clean & stain extraction",
      "Window cleaning (streak-free glass)",
      "Gardening, lawn maintenance & weeding",
      "Odd jobs & property repairs support",
      "Custom project estimates",
    ],
    idealFor: ["Homes & gardens", "Shopfronts & offices", "Landlords & property managers", "One-off tidy-ups and projects"],
    howPricingWorks:
      "Each project is quoted separately based on its size and the equipment needed. Describe the job and we'll reply with a free, no-obligation price.",
    quoteSubject: "Quote Request: Gardening, Windows & Odd Jobs",
    actionLabel: "Get Project Quote",
    accent: "teal",
  },
];

const ACCENT = {
  teal: {
    iconWrap: "bg-teal-50 text-teal-700 ring-1 ring-teal-200/60",
    badge: "bg-slate-100 text-slate-700",
    price: "text-teal-700",
    check: "text-teal-600",
    card: "border-slate-200/80 bg-white/90 backdrop-blur-md hover:border-teal-400/50",
    link: "text-teal-700",
  },
  amber: {
    iconWrap: "bg-amber-100 text-amber-800 ring-1 ring-amber-300",
    badge: "bg-amber-100 text-amber-900 border border-amber-300",
    price: "text-amber-700",
    check: "text-amber-600",
    card: "border-amber-400/70 bg-linear-to-b from-amber-50/40 via-white to-white ring-2 ring-amber-400/20 hover:border-amber-500",
    link: "text-amber-700",
  },
} as const;

export function Services() {
  const { requestQuote } = useQuote();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = SERVICES.find((s) => s.id === activeId) ?? null;

  const handleQuote = (service: ServicePackage) => {
    setActiveId(null);
    requestQuote(service.quoteSubject);
  };

  return (
    <section id="services" className="py-20 sm:py-28 bg-surface/65 backdrop-blur-md relative z-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-7">
        <SectionHeading
          eyebrow="Our Services"
          title="Pricing & Quotation Guide"
          description="Clear, competitive pricing for commercial, deep cleaning, certified confined space and specialist property support. Tap any package for full details. Free no-obligation quotations available for every project."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            const a = ACCENT[service.accent];

            return (
              <Reveal key={service.id} delay={i * 0.08} y={20} className="flex h-full flex-col">
                <Card3D depth={10} className="rounded-3xl">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`View ${service.title} package details`}
                    onClick={() => setActiveId(service.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveId(service.id);
                      }
                    }}
                    className={`group flex flex-col h-full cursor-pointer rounded-3xl border p-6 sm:p-7 shadow-xs transition-all duration-300 hover:shadow-xl relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${a.card}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Pop3D z={30} className={`grid size-11 place-items-center rounded-2xl ${a.iconWrap}`}>
                        <Icon className="size-5" />
                      </Pop3D>
                      <Pop3D z={25}>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs ${a.badge}`}>
                          {service.badge}
                        </span>
                      </Pop3D>
                    </div>

                    <Pop3D z={20}>
                      <h3 className="font-display text-xl font-bold text-slate-900">{service.title}</h3>
                    </Pop3D>

                    <Pop3D z={35} className="mt-3">
                      <span className={`text-2xl font-bold ${a.price}`}>{service.priceText}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{service.priceSub}</p>
                    </Pop3D>

                    <p className="mt-3 text-sm text-slate-600 mb-5 leading-relaxed">{service.description}</p>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {service.includes.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <CheckCircle2 className={`size-4 shrink-0 mt-0.5 ${a.check}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <span className={`mt-auto inline-flex items-center gap-1.5 text-sm font-semibold ${a.link}`}>
                      View package details
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Card3D>
              </Reveal>
            );
          })}
        </div>

        {/* Free No-Obligation Quotation Banner */}
        <Reveal delay={0.3} y={20} className="mt-16">
          <div className="rounded-3xl bg-surface border border-line p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-hover mb-3">
                <Sparkles className="size-3.5" /> Free No-Obligation Quotations
              </span>
              <h3 className="font-display text-2xl font-bold text-ink">
                Need a bespoke quote for your premises or project?
              </h3>
              <p className="mt-2 text-sm text-muted">
                Commercial premises, deep cleaning, certified confined spaces, end of tenancy, gardening, or odd jobs — we provide tailored quotes with zero commitment.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => requestQuote("General No-Obligation Quotation")} className="group">
                Request Free Quote
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Package details dialog */}
      <Dialog.Root open={active !== null} onOpenChange={(o) => !o && setActiveId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="cs-overlay fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm" />
          <Dialog.Content
            className="cs-modal fixed left-1/2 top-1/2 z-50 flex max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 focus:outline-none"
            aria-describedby={undefined}
          >
            {active && (() => {
              const Icon = active.icon;
              const a = ACCENT[active.accent];
              return (
                <>
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
                    <div className="flex items-start gap-4">
                      <div className={`grid size-12 shrink-0 place-items-center rounded-2xl ${a.iconWrap}`}>
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${a.badge}`}>
                          {active.badge}
                        </span>
                        <Dialog.Title className="mt-1.5 font-display text-2xl font-bold text-slate-900">
                          {active.title}
                        </Dialog.Title>
                        <p className={`mt-1 text-xl font-bold ${a.price}`}>{active.priceText}</p>
                        <p className="text-xs text-slate-500">{active.priceSub}</p>
                      </div>
                    </div>
                    <Dialog.Close
                      aria-label="Close"
                      className="-mr-2 -mt-2 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                    >
                      <X className="size-5" />
                    </Dialog.Close>
                  </div>

                  <div className="space-y-6 overflow-y-auto p-6">
                    <p className="text-sm leading-relaxed text-slate-600">{active.description}</p>

                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">What&apos;s included</h4>
                      <ul className="mt-3 space-y-2.5">
                        {active.includes.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                            <CheckCircle2 className={`mt-0.5 size-4 shrink-0 ${a.check}`} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900">Ideal for</h4>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {active.idealFor.map((item) => (
                          <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/80">
                      <h4 className="text-sm font-bold text-slate-900">How pricing works</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{active.howPricingWorks}</p>
                      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="size-3.5" /> Serving Suffolk, Cambridgeshire &amp; Cambridge
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 p-5 sm:flex-row">
                    <Button size="lg" className="group flex-1" onClick={() => handleQuote(active)}>
                      {active.actionLabel}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button asChild size="lg" variant="outline" className="sm:w-auto">
                      <a href={SITE.phoneHref}>
                        <Phone className="size-4" />
                        {SITE.phoneDisplay}
                      </a>
                    </Button>
                  </div>
                </>
              );
            })()}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
