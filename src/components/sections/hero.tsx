"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, ArrowRight, BadgeCheck, Sparkles, HardHat } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/section";
import { Card3D, Pop3D } from "@/components/ui/card-3d";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Segmented, Stepper } from "@/components/ui/controls";
import { useBooking } from "@/components/booking/booking-provider";
import { Logo3D } from "@/components/3d/logo-3d";
import {
  estimatePrice,
  BEDROOM_OPTIONS,
  BATHROOM_OPTIONS,
  COMMERCIAL_HOURS,
  COMMERCIAL_TYPES,
  COMMERCIAL_TYPE_LABELS,
} from "@/lib/pricing";
import { formatGBP } from "@/lib/utils";
import type { BookingFormValues } from "@/lib/validation";

export function Hero() {
  const { openBooking } = useBooking();
  
  // Quick Estimator State
  const [serviceType, setServiceType] = useState<BookingFormValues["serviceType"]>("commercial");
  const [bedrooms, setBedrooms] = useState<BookingFormValues["bedrooms"]>("2");
  const [bathrooms, setBathrooms] = useState<BookingFormValues["bathrooms"]>("1");
  const [commercialType, setCommercialType] = useState<BookingFormValues["commercialType"]>("offices");
  const [commercialHours, setCommercialHours] = useState<BookingFormValues["commercialHours"]>("3");

  const estimate = estimatePrice({
    service: serviceType,
    bedrooms,
    bathrooms,
    commercialHours,
    addons: [],
    frequency: "one-off",
  });

  const handleBook = () => {
    openBooking({
      serviceType,
      bedrooms,
      bathrooms,
      commercialType,
      commercialHours,
      frequency: "one-off",
      addons: [],
    });
  };

  return (
    <section id="home" className="relative overflow-hidden bg-linear-to-b from-teal-50/40 via-white/50 to-surface/60 backdrop-blur-xs pt-20 pb-20 sm:pt-28 sm:pb-28 relative z-10">
      {/* Background ambient luxury gradient rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-linear-to-tr from-teal-500/10 via-amber-400/5 to-transparent rounded-full blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-5 sm:px-7">
        <div className="grid gap-12 lg:grid-cols-[1.1fr,1fr] lg:gap-8 items-center">
          
          {/* Left: Copy & Trust Elements */}
          <div className="max-w-2xl">
            <Reveal y={20}>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-xs ring-1 ring-amber-500/20">
                  <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                  Reliable • Professional • Family Run
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-900/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/30 shadow-xs">
                  <Sparkles className="size-3 text-amber-400 animate-spin" />
                  Awakened Sanctuary • Suffolk, Cambridgeshire & Cambridge
                </div>
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-[3.8rem] lg:leading-[1.12]">
                Professional Cleaning &
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
            
            <Reveal delay={0.2} y={20}>
              <div className="mt-8 flex flex-wrap gap-3.5 items-center">
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
                  <span className="text-xs font-semibold text-ink">COSHH & H&S Practices</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 shadow-xs ring-1 ring-slate-200 hover:ring-amber-400/40 transition-all">
                  <HardHat className="size-4 text-amber-600" />
                  <span className="text-xs font-semibold text-ink">Certified Confined Space</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 shadow-xs ring-1 ring-slate-200 hover:ring-amber-400/40 transition-all">
                  <span className="size-2 rounded-full bg-teal-500" />
                  <span className="text-xs font-semibold text-ink">Commercial & Residential</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Quick Estimator Widget */}
          <Reveal delay={0.3} y={30} className="w-full max-w-md mx-auto lg:ml-auto lg:mr-0">
            <Card3D depth={10} className="rounded-3xl">
              <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl ring-1 ring-slate-200/80 border-t-2 border-amber-400/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center justify-between mb-6">
                  <Pop3D z={25}>
                    <h3 className="font-display text-xl font-bold text-ink">Quick Price Estimator</h3>
                  </Pop3D>
                  <Pop3D z={40}>
                    <span className="rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider shadow-xs">
                      Instant Quote
                    </span>
                  </Pop3D>
                </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-ink">Service Type</label>
                  <Segmented
                    label="Service Type"
                    options={[
                      { value: "commercial", label: "Commercial" },
                      { value: "regular", label: "Residential" },
                      { value: "deep", label: "Deep Clean" },
                      { value: "tenancy", label: "Tenancy" },
                    ]}
                    value={serviceType}
                    onChange={setServiceType}
                  />
                </div>

                {serviceType === "commercial" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Stepper
                        label="Premises"
                        unit={(v) => COMMERCIAL_TYPE_LABELS[v as keyof typeof COMMERCIAL_TYPE_LABELS] ?? v}
                        value={commercialType}
                        options={COMMERCIAL_TYPES}
                        onChange={(v) => setCommercialType(v as any)}
                      />
                    </div>
                    <div className="space-y-3">
                      <Stepper
                        label="Est. Hours"
                        unit={(v) => `${v} hrs`}
                        value={commercialHours}
                        options={COMMERCIAL_HOURS}
                        onChange={(v) => setCommercialHours(v as any)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Stepper
                        label="Bedrooms"
                        unit={(v) => v}
                        value={bedrooms}
                        options={BEDROOM_OPTIONS}
                        onChange={setBedrooms}
                      />
                    </div>
                    <div className="space-y-3">
                      <Stepper
                        label="Bathrooms"
                        unit={(v) => v}
                        value={bathrooms}
                        options={BATHROOM_OPTIONS}
                        onChange={setBathrooms}
                      />
                    </div>
                  </div>
                )}
                
                <div className="pt-6 border-t border-line mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted">Estimated price</p>
                    <p className="font-display text-3xl font-bold tabular-nums text-ink">
                      <AnimatedNumber value={estimate.total} format={formatGBP} />
                    </p>
                  </div>
                  <Button size="lg" onClick={handleBook} className="group px-6">
                    Book Now
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Card3D>
          </Reveal>
          
        </div>
      </div>
    </section>
  );
}
