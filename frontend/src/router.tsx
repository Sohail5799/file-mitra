import {
  Link,
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider
} from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { HomePage } from "./views/HomePage";
import { ImageToJpegPage } from "./views/ImageToJpegPage";
import { PdfMakerPage } from "./views/PdfMakerPage";
import { PdfConvertPage } from "./views/PdfConvertPage";
import { ImageCompressorPage } from "./views/ImageCompressorPage";
import { PdfCompressorPage } from "./views/PdfCompressorPage";
import { PdfMergePage } from "./views/PdfMergePage";
import { OcrPage } from "./views/OcrPage";
import { AboutPage } from "./views/AboutPage";
import { ContactPage } from "./views/ContactPage";
import { PrivacyPolicyPage } from "./views/PrivacyPolicyPage";
import { ImageToolsPage } from "./views/ImageToolsPage";
import { PdfToolsPage } from "./views/PdfToolsPage";

function NavLink(props: { to: string; label: string }) {
  return (
    <Link
      to={props.to}
      className="rounded-full px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
      activeProps={{
        className: "rounded-full bg-white/90 px-3 py-2 text-sm text-slate-950 shadow"
      }}
    >
      {props.label}
    </Link>
  );
}

function RootLayout() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!dropdownRef.current) return;
      const target = event.target as Node | null;
      if (target && !dropdownRef.current.contains(target)) {
        setToolsOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="sticky top-4 z-30">
          <div className="app-shell premium-nav-wrap flex flex-col gap-4 rounded-3xl p-4 md:flex-row md:items-center md:justify-between md:px-5">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-3 rounded-2xl p-1 transition hover:bg-white/5">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-200 via-white to-cyan-100 text-slate-900 shadow-lg shadow-indigo-200/20">
                  <div className="text-xs font-bold tracking-wide">FM</div>
                </div>
                <div>
                  <div className="text-base font-semibold tracking-tight text-white">
                    File Mitra
                  </div>
                  <div className="text-xs text-slate-400">Premium file utility suite</div>
                </div>
              </Link>
            </div>

            <nav className="premium-nav-pill flex flex-wrap items-center gap-2 rounded-full p-1.5">
              <NavLink to="/" label="Home" />

              <div className="group relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setToolsOpen((prev) => !prev)}
                  className="cursor-pointer list-none rounded-full px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Tools
                </button>
                <div
                  className={`premium-dropdown absolute right-0 top-12 z-40 w-64 rounded-2xl p-2 shadow-2xl ${
                    toolsOpen ? "premium-dropdown-open" : ""
                  }`}
                >
                  <div className="mb-2 px-2 text-[11px] uppercase tracking-[0.2em] text-slate-400">Tool Hubs</div>
                  <div className="grid gap-1">
                    <Link to="/image-tools" onClick={() => setToolsOpen(false)} className="rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white">Image Tools (Convert + Compress)</Link>
                    <Link to="/pdf-tools" onClick={() => setToolsOpen(false)} className="rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white">PDF Tools (Convert + Compress + Merge)</Link>
                    <Link to="/ocr" onClick={() => setToolsOpen(false)} className="rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white">OCR Extractor</Link>
                  </div>
                </div>
              </div>

              <NavLink to="/about" label="About Us" />
              <NavLink to="/contact" label="Contact Us" />
            </nav>
          </div>
        </header>

        <main className="mt-8">
          <Outlet />
        </main>

        <footer className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <div>Fast, private, and simple.</div>
            <div className="flex items-center gap-3">
              <Link to="/about" className="hover:text-white">About</Link>
              <Link to="/contact" className="hover:text-white">Contact</Link>
              <Link to="/privacy-policy" className="hover:text-white">Privacy</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const rootRoute = new RootRoute({
  component: RootLayout
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage
});

const imageToJpegRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/image-to-jpeg",
  component: ImageToJpegPage
});

const pdfMakerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/pdf-maker",
  component: PdfMakerPage
});

const pdfConvertRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/pdf-convert",
  component: PdfConvertPage
});

const imageCompressorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/image-compressor",
  component: ImageCompressorPage
});

const pdfCompressorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/pdf-compressor",
  component: PdfCompressorPage
});

const pdfMergeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/pdf-merge",
  component: PdfMergePage
});

const ocrRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/ocr",
  component: OcrPage
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage
});

const contactRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage
});

const privacyPolicyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage
});

const imageToolsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/image-tools",
  component: ImageToolsPage
});

const pdfToolsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/pdf-tools",
  component: PdfToolsPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  imageToolsRoute,
  pdfToolsRoute,
  imageToJpegRoute,
  pdfMakerRoute,
  pdfConvertRoute,
  imageCompressorRoute,
  pdfCompressorRoute,
  pdfMergeRoute,
  ocrRoute,
  aboutRoute,
  contactRoute,
  privacyPolicyRoute
]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}

