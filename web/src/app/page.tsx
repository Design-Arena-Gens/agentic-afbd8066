'use client';

import { RunwayScene } from '@/components/RunwayScene';

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-10 text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(82,109,255,0.18),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(255,175,104,0.12),_transparent_52%)]" />
      </div>

      <header className="flex w-full max-w-6xl items-center justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.48em] text-slate-400">Winter 24 Collection</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-100 md:text-6xl">
            Field Parka Ensemble Showcase
          </h1>
        </div>
        <div className="hidden flex-col items-end text-right md:flex">
          <span className="text-xs uppercase tracking-[0.4em] text-slate-500">Runway Loop</span>
          <span className="text-lg font-medium text-slate-200">Autonomous Lookbook 01</span>
        </div>
      </header>

      <main className="mt-10 flex w-full max-w-6xl flex-col gap-10 rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-[0_40px_100px_-40px_rgba(15,23,42,0.75)] backdrop-blur-xl md:p-10">
        <section className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-100 md:text-3xl">
              Storm-Ready Technical Silhouette
            </h2>
            <p className="text-sm leading-relaxed text-slate-300 md:text-base">
              A high-definition digital garment featuring a weatherproof field parka paired with articulated tactical
              pants and insulated boots. Rendered with 2K procedural textiles, the look is staged under cinematic studio
              lighting with a continuous runway animation to highlight drape, gloss, and fabric depth.
            </p>
            <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.32em] text-slate-400">
              <span className="rounded-full bg-white/5 px-4 py-2">High Poly</span>
              <span className="rounded-full bg-white/5 px-4 py-2">2K Fabric Maps</span>
              <span className="rounded-full bg-white/5 px-4 py-2">Procedural Stage</span>
              <span className="rounded-full bg-white/5 px-4 py-2">Runway Animation</span>
            </div>
          </div>
          <div className="h-[520px] rounded-3xl border border-white/10 bg-slate-900/40 p-2 md:h-[640px]">
            <RunwayScene />
          </div>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Outer Shell</p>
            <p className="mt-2 text-sm text-slate-200">
              Breathable nylon weave with matte depth, tailored for layered field operations in sub-zero conditions.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Lower Assembly</p>
            <p className="mt-2 text-sm text-slate-200">
              Reinforced knees and articulated seams with ergonomic taper, supported by insulated combat footwear.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Studio Rig</p>
            <p className="mt-2 text-sm text-slate-200">
              Multi-point LED rig, runway floor wash, and volumetric contrast designed for premium showcase fidelity.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
