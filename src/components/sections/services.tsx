"use client";

import { CheckCircle2, Building2, KeyRound, Home, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/ui/section";
import { Card3D, Pop3D } from "@/components/ui/card-3d";
import { useBooking } from "@/components/booking/booking-provider";
import { Segmented } from "@/components/ui/controls";
import type { BookingFormValues } from "@/lib/validation";

const SERVICES = [
  {
    id: "commercial" as const,
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
    actionType: "quote" as const,
    actionLabel: "Request Commercial Quote",
  },
  {
    id: "tenancy" as const,
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
    actionType: "book" as const,
    actionLabel: "Book Tenancy Clean",
  },
  {
    id: "regular" as const,
    icon: Home,
    title: "Domestic & Deep Cleaning",
    badge: "Family-Run Quality",
    priceText: "From £18/hr",
    priceSub: "Deep Cleans from £120",
    description: "Reliable domestic visits or thorough deep cleans tailored around your home life.",
    includes: [
      "Deep cleaning & one-off visits",
      "Recurring weekly / fortnightly cleans",
      "Kitchens, bathrooms & living spaces",
      "High touchpoint sanitation & dusting",
      "Friendly, trusted family-run cleaners",
    ],
    actionType: "book" as const,
    actionLabel: "Book Domestic Clean",
  },
  {
    id: "specialist" as const,
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
    actionType: "quote" as const,
    actionLabel: "Get Project Quote",
  },
];

export function Services() {
  const { openBooking, requestQuote } = useBooking();
  const [frequency, setFrequency] = useState<BookingFormValues["frequency"]>("one-off");

  return (
    <section id="services" className="py-20 sm:py-28 bg-surface/65 backdrop-blur-md relative z-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-7">
        <SectionHeading
          eyebrow="Our Services"
          title="Pricing & Quotation Guide"
          description="Clear, competitive pricing for domestic, commercial, and specialist property support. Free no-obligation quotations available for every project."
        />

        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-xs">
            <Segmented
              label="Frequency"
              options={[
                { value: "one-off", label: "One-Off / Project" },
                { value: "subscription", label: "Regular Contract (Save 15%)" },
              ]}
              value={frequency}
              onChange={setFrequency}
            />
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, i) => {
            const Icon = service.icon;
            const isTenancy = service.id === "tenancy";

            return (
              <Reveal key={service.id} delay={i * 0.08} y={20} className="flex h-full flex-col">
                <Card3D depth={10} className="rounded-3xl">
                  <div
                    className={`flex flex-col h-full rounded-3xl border p-6 sm:p-7 shadow-xs transition-all duration-300 hover:shadow-xl relative overflow-hidden ${
                      isTenancy
                        ? "border-amber-400/80 bg-linear-to-b from-amber-50/40 via-white to-white ring-2 ring-amber-400/30"
                        : "border-slate-200/80 bg-white/90 backdrop-blur-md hover:border-teal-400/50"
                    }`}
                  >
                    {isTenancy && (
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <Pop3D z={30} className={`grid size-11 place-items-center rounded-2xl ${
                        isTenancy
                          ? "bg-amber-100 text-amber-800 ring-1 ring-amber-300"
                          : "bg-teal-50 text-teal-700 ring-1 ring-teal-200/60"
                      }`}>
                        <Icon className="size-5" />
                      </Pop3D>
                      <Pop3D z={25}>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold shadow-xs ${
                          isTenancy
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {service.badge}
                        </span>
                      </Pop3D>
                    </div>

                    <Pop3D z={20}>
                      <h3 className="font-display text-xl font-bold text-slate-900">{service.title}</h3>
                    </Pop3D>
                    
                    <Pop3D z={35} className="mt-3">
                      <span className={`text-2xl font-bold ${isTenancy ? "text-amber-700" : "text-teal-700"}`}>
                        {service.priceText}
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">{service.priceSub}</p>
                    </Pop3D>

                    <p className="mt-3 text-sm text-slate-600 mb-6 leading-relaxed">{service.description}</p>

                    <ul className="space-y-3 mb-8 flex-1">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <CheckCircle2 className={`size-4 shrink-0 mt-0.5 ${isTenancy ? "text-amber-600" : "text-teal-600"}`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full mt-auto font-semibold shadow-xs ${
                        isTenancy
                          ? "bg-amber-600 hover:bg-amber-500 text-white"
                          : "border-teal-200 text-teal-800 hover:bg-teal-50"
                      }`}
                      variant={isTenancy ? "primary" : "outline"}
                      onClick={() => {
                        const svcMap: Record<string, BookingFormValues["serviceType"]> = {
                          commercial: "commercial",
                          tenancy: "tenancy",
                          regular: "regular",
                          specialist: "specialist",
                        };
                        openBooking({
                          serviceType: svcMap[service.id] ?? "commercial",
                          frequency,
                        });
                      }}
                    >
                      {service.actionLabel}
                    </Button>
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
                Commercial premises, communal areas, end of tenancy, gardening, or odd jobs — we provide tailored quotes with zero commitment.
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => requestQuote("General No-Obligation Quotation")}
                className="group"
              >
                Request Free Quote
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
