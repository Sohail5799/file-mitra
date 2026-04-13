import {
  Link,
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  useRouterState
} from "@tanstack/react-router";
import clsx from "clsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { applyRouteSeo } from "./lib/routeSeo";
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
import { BlogIndexPage } from "./views/BlogIndexPage";
import { BlogPostPage } from "./views/BlogPostPage";
import { ResumeBuilderPage } from "./views/resume/ResumeBuilderPage";

function NavLink(props: { to: string; label: string }) {
  return (
    <Link
      to={props.to}
      className="flex min-w-0 shrink-0 items-center justify-center rounded-full px-2.5 py-1.5 text-center text-xs text-slate-300 transition hover:bg-white/10 hover:text-white max-sm:w-full sm:px-3 sm:py-2 sm:text-sm"
      activeProps={{
        className:
          "flex min-w-0 shrink-0 items-center justify-center rounded-full bg-white/90 px-2.5 py-1.5 text-center text-xs text-slate-950 shadow max-sm:w-full sm:px-3 sm:py-2 sm:text-sm"
      }}
    >
      {props.label}
    </Link>
  );
}

/** Stand-out CTA in the nav — soft pulse + shimmer so new visitors notice Resume. */
function ResumeNavLink() {
  return (
    <Link
      to="/resume"
      className={clsx(
        "resume-nav-cta group relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-full px-2.5 py-1.5 text-center text-xs sm:w-auto sm:px-3 sm:py-2 sm:text-sm"
      )}
      activeProps={{
        className: clsx(
          "resume-nav-cta-active flex w-full shrink-0 items-center justify-center rounded-full px-2.5 py-1.5 text-center text-xs sm:w-auto sm:px-3 sm:py-2 sm:text-sm"
        )
      }}
    >
      <span className="resume-nav-cta__shine pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <span className="relative z-[1] font-semibold tracking-wide text-indigo-50 drop-shadow-sm group-hover:text-white">
        Resume
      </span>
    </Link>
  );
}

function RouteMetaSync() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useLayoutEffect(() => {
    applyRouteSeo(pathname);
  }, [pathname]);
  return null;
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
    <div className="min-h-screen min-w-0">
      <RouteMetaSync />
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-8">
        <header className="sticky top-2 z-30 sm:top-4">
          <div className="app-shell premium-nav-wrap flex min-w-0 flex-col gap-3 rounded-2xl p-3 sm:gap-4 sm:rounded-3xl sm:p-4 md:flex-row md:items-center md:justify-between md:px-5">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <Link
                to="/"
                className="flex min-w-0 items-center gap-2 rounded-2xl p-1 transition hover:bg-white/5 sm:gap-3"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-200 via-white to-cyan-100 text-slate-900 shadow-lg shadow-indigo-200/20 sm:h-10 sm:w-10 sm:rounded-2xl">
                  <div className="text-[10px] font-bold tracking-wide sm:text-xs">FM</div>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold tracking-tight text-white sm:text-base">
                    File Mitra
                  </div>
                  <div className="text-[10px] leading-tight text-slate-400 sm:text-xs">
                    Premium file utility suite
                  </div>
                </div>
              </Link>
            </div>

            <nav
              className={clsx(
                "premium-nav-pill relative w-full min-w-0 rounded-2xl p-1",
                "grid grid-cols-3 gap-x-0.5 gap-y-2 px-1 py-2 place-items-stretch",
                "sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-2 sm:rounded-full sm:p-1.5 sm:py-1.5 md:w-auto md:flex-nowrap md:justify-end"
              )}
            >
              <NavLink to="/" label="Home" />
              <NavLink to="/blog" label="Blog" />
              <ResumeNavLink />

              {/* Mobile: static → dropdown anchors to full nav width. md+: relative → under Tools. */}
              <div
                ref={dropdownRef}
                className="max-sm:flex max-sm:w-full max-sm:min-w-0 max-sm:flex-col max-md:static md:relative md:shrink-0"
              >
                <button
                  type="button"
                  onClick={() => setToolsOpen((prev) => !prev)}
                  className="w-full cursor-pointer list-none rounded-full px-2.5 py-1.5 text-center text-xs text-slate-300 transition hover:bg-white/10 hover:text-white sm:w-auto sm:px-3 sm:py-2 sm:text-sm"
                >
                  Tools
                </button>
                <div
                  className={`premium-dropdown premium-dropdown-panel absolute z-40 mt-1 max-md:inset-x-1 max-md:top-full max-md:min-w-0 md:right-0 md:top-full md:w-64 ${
                    toolsOpen ? "premium-dropdown-open" : ""
                  } `}
                >
                  <div className="mb-2 px-2 text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:text-[11px] sm:tracking-[0.2em]">
                    Tool Hubs
                  </div>
                  <div className="grid min-w-0 gap-0.5">
                    <Link
                      to="/image-tools"
                      onClick={() => setToolsOpen(false)}
                      className="break-words rounded-xl px-2.5 py-2 text-left text-xs leading-snug text-slate-200 transition hover:bg-white/10 hover:text-white sm:rounded-full sm:px-3 sm:text-sm"
                    >
                      Image Tools (Convert + Compress)
                    </Link>
                    <Link
                      to="/pdf-tools"
                      onClick={() => setToolsOpen(false)}
                      className="break-words rounded-xl px-2.5 py-2 text-left text-xs leading-snug text-slate-200 transition hover:bg-white/10 hover:text-white sm:rounded-full sm:px-3 sm:text-sm"
                    >
                      PDF Tools (Convert + Compress + Merge)
                    </Link>
                    <Link
                      to="/ocr"
                      onClick={() => setToolsOpen(false)}
                      className="break-words rounded-xl px-2.5 py-2 text-left text-xs leading-snug text-slate-200 transition hover:bg-white/10 hover:text-white sm:rounded-full sm:px-3 sm:text-sm"
                    >
                      OCR Extractor
                    </Link>
                    <Link
                      to="/blog"
                      onClick={() => setToolsOpen(false)}
                      className="break-words rounded-xl px-2.5 py-2 text-left text-xs leading-snug text-slate-200 transition hover:bg-white/10 hover:text-white sm:rounded-full sm:px-3 sm:text-sm"
                    >
                      Blog & guides
                    </Link>
                    <Link
                      to="/resume"
                      onClick={() => setToolsOpen(false)}
                      className="break-words rounded-xl px-2.5 py-2 text-left text-xs leading-snug text-slate-200 transition hover:bg-white/10 hover:text-white sm:rounded-full sm:px-3 sm:text-sm"
                    >
                      Resume Studio
                    </Link>
                  </div>
                </div>
              </div>

              <NavLink to="/about" label="About" />
              <NavLink to="/contact" label="Contact" />
            </nav>
          </div>
        </header>

        <main className="mt-5 min-w-0 sm:mt-8">
          <Outlet />
        </main>

        <footer className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <div>Fast, private, and simple.</div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/resume" className="hover:text-white">Resume</Link>
              <Link to="/blog" className="hover:text-white">Blog</Link>
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

const blogIndexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogIndexPage
});

const blogPostRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/blog/$slug",
  component: BlogPostPage
});

const resumeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/resume",
  component: ResumeBuilderPage
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
  privacyPolicyRoute,
  blogIndexRoute,
  blogPostRoute,
  resumeRoute
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

