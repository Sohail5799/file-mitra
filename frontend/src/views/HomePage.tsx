import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Card } from "../ui/Card";
import { Section } from "../ui/Section";
import { useCountUp } from "../lib/useCountUp";

export function HomePage() {
  const users = useCountUp({ to: 12800, durationMs: 1200 });
  const images = useCountUp({ to: 540000, durationMs: 1300, startDelayMs: 80 });
  const pdfs = useCountUp({ to: 9300, durationMs: 1350, startDelayMs: 140 });
  const graphProgress = useCountUp({ to: 100, durationMs: 1500, startDelayMs: 180 });

  const trend = [
    { label: "Mon", value: 38 },
    { label: "Tue", value: 44 },
    { label: "Wed", value: 56 },
    { label: "Thu", value: 62 },
    { label: "Fri", value: 74 },
    { label: "Sat", value: 81 },
    { label: "Sun", value: 92 }
  ];

  const reviews = [
    {
      logo: "NX",
      company: "Nexa Studio",
      quote: "Super clean UI and really fast conversion. Team uses this daily."
    },
    {
      logo: "AB",
      company: "Apex Books",
      quote: "Image to PDF flow is smooth. The reorder option saves us a lot of time."
    },
    {
      logo: "KF",
      company: "Kraft Finance",
      quote: "Reliable outputs and minimal clicks. Exactly what we needed for operations."
    },
    {
      logo: "UT",
      company: "Urban Tech",
      quote: "Dark theme plus simple UX feels premium. Great internal utility tool."
    }
  ];
  const tools = [
    {
      title: "Image Tools",
      desc: "Convert and compress images in one place.",
      to: "/image-tools"
    },
    {
      title: "PDF Tools",
      desc: "Convert, compress and merge PDFs from one dashboard.",
      to: "/pdf-tools"
    },
    {
      title: "OCR Extractor",
      desc: "Extract text from images and PDFs.",
      to: "/ocr"
    }
  ];
  const [activeReview, setActiveReview] = useState(0);
  const [activeTool, setActiveTool] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reviews.length]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveTool((prev) => (prev + 1) % tools.length);
    }, 2300);
    return () => window.clearInterval(id);
  }, [tools.length]);

  const fmt = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
  const animatedTrend = useMemo(
    () => trend.map((item) => ({ ...item, current: Math.round((item.value * graphProgress) / 100) })),
    [graphProgress]
  );

  return (
    <div className="space-y-6">
      <Section className="premium-hero">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium tracking-wide text-slate-400">
              One-click premium file workflows
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl">
              Premium converter suite for daily work
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
              Transform, compress, merge and OCR files in a clean modern experience. Fast performance,
              elegant UI, and practical tools that keep expanding as your workflow grows.
            </p>
            <div className="mt-3 flex flex-col gap-2 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center">
              <Link to="/pdf-tools" className="btn-primary w-full justify-center min-[400px]:w-auto">
                Open PDF Tools
              </Link>
              <Link to="/image-tools" className="btn-secondary w-full justify-center min-[400px]:w-auto">
                Open Image Tools
              </Link>
            </div>
            {/* <div className="mt-4 text-xs text-slate-400">
              All tools rotate automatically.
            </div> */}
          </div>

          <div className="surface-muted p-4">
            <div className="text-xs uppercase tracking-wide text-slate-400">Tools carousel</div>
            <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/20 p-4">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${activeTool * 100}%)` }}
              >
                {tools.map((tool) => (
                  <div key={tool.title} className="w-full shrink-0">
                    <div className="text-lg font-semibold text-white">{tool.title}</div>
                    <p className="mt-1 text-sm text-slate-300">{tool.desc}</p>
                    <Link to={tool.to} className="btn-secondary mt-4">
                      Open Tool
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              {tools.map((tool, idx) => (
                <button
                  key={tool.title}
                  onClick={() => setActiveTool(idx)}
                  className={idx === activeTool ? "h-2.5 w-6 rounded-full bg-white" : "h-2.5 w-2.5 rounded-full bg-white/30"}
                  aria-label={`Go to tool ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* <section className="surface-muted px-6 py-5">
        <div className="grid grid-cols-2 gap-5 text-center text-slate-400 md:grid-cols-6">
          <div>Vercel</div>
          <div>Zapier</div>
          <div>Raycast</div>
          <div>Loom</div>
          <div>CashApp</div>
          <div>Notion</div>
        </div>
      </section> */}

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Trusted" description="Used by millions of users worldwide.">
          <div className="mt-1 text-3xl font-semibold tracking-tight text-white tabular-nums">
            {fmt.format(users)}+
          </div>
          <div className="mt-1 text-xs text-slate-400">Users</div>
        </Card>
        <Card title="Activity" description="Conversions completed so far.">
          <div className="mt-1 text-3xl font-semibold tracking-tight text-white tabular-nums">
            {fmt.format(images)}+
          </div>
          <div className="mt-1 text-xs text-slate-400">Images converted</div>
        </Card>
        <Card title="PDFs" description="PDFs created with this tool.">
          <div className="mt-1 text-3xl font-semibold tracking-tight text-white tabular-nums">
            {fmt.format(pdfs)}+
          </div>
          <div className="mt-1 text-xs text-slate-400">PDFs generated</div>
        </Card>
      </div>

      <Section title="Usage Analytics" description="Modern weekly trend and volume mix.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="surface-muted p-4 md:col-span-2">
            <div className="text-sm font-medium text-slate-200">Weekly trend</div>
            <div className="mt-4 flex h-44 min-h-0 items-end gap-1 sm:h-52 sm:gap-2">
              {animatedTrend.map((item) => (
                <div key={item.label} className="flex min-w-0 flex-1 flex-col items-center gap-1 sm:gap-2">
                  <div className="text-[10px] text-slate-400 tabular-nums">{item.current}k</div>
                  <div className="relative w-full overflow-hidden rounded-t-lg bg-white/5" style={{ height: "140px" }}>
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-lg bg-gradient-to-t from-indigo-500 to-fuchsia-400 transition-all duration-500"
                      style={{ height: `${item.current}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="surface-muted p-4">
            <div className="text-sm font-medium text-slate-200">Tool share</div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-300"><span>Image tools</span><span>42%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[42%] rounded-full bg-indigo-400" /></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-300"><span>PDF tools</span><span>38%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[38%] rounded-full bg-fuchsia-400" /></div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-300"><span>OCR</span><span>20%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[20%] rounded-full bg-emerald-400" /></div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="User Reviews" description="What teams say about this tool.">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${activeReview * 100}%)` }}
          >
            {reviews.map((item) => (
              <div key={item.company} className="w-full shrink-0 pr-1">
                <div className="surface-muted p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-sm font-semibold text-white">
                      {item.logo}
                    </div>
                    <div className="text-sm font-medium text-white">{item.company}</div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">{item.quote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {reviews.map((item, idx) => (
            <button
              key={item.company}
              onClick={() => setActiveReview(idx)}
              className={idx === activeReview ? "h-2.5 w-6 rounded-full bg-white" : "h-2.5 w-2.5 rounded-full bg-white/30"}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </Section>

      <section className="surface p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold text-white">Converter</div>
            <div className="mt-1 text-sm text-slate-300">
              Fast file tools for daily workflow.
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-white">Tools</div>
            <div className="mt-2 space-y-1 text-sm text-slate-300">
              <div>Image Converter</div>
              <div>Image Compressor</div>
              <div>PDF Maker</div>
              <div>PDF to Excel/Doc</div>
              <div>PDF Compressor</div>
              <div>Merge PDF</div>
              <div>OCR Extractor</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-white">Built with</div>
            <div className="mt-2 space-y-1 text-sm text-slate-300">
              <div>React + TanStack</div>
              <div>FastAPI</div>
              <div>Pillow + PDF tools</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

