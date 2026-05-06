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
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { TermsAndConditionsPage } from "./views/TermsAndConditionsPage";
import { ImageToolsPage } from "./views/ImageToolsPage";
import { PdfToolsPage } from "./views/PdfToolsPage";
import { BlogIndexPage } from "./views/BlogIndexPage";
import { BlogPostPage } from "./views/BlogPostPage";
import { HowItWorksPage } from "./views/HowItWorksPage";
const QrCodePage = lazy(() => import("./views/QrCodePage").then((m) => ({ default: m.QrCodePage })));
const ResumeBuilderPage = lazy(() =>
  import("./views/resume/ResumeBuilderPage").then((m) => ({ default: m.ResumeBuilderPage }))
);

function NavLink(props: { to: string; label: string; onPick?: () => void; className?: string }) {
  return (
    <Link
      to={props.to}
      onClick={() => props.onPick?.()}
      className={clsx(
        "nav-mag-link flex min-w-0 shrink-0 items-center justify-center rounded-full px-2.5 py-1.5 text-center text-xs sm:px-3 sm:py-2 sm:text-sm",
        props.className
      )}
      activeProps={{
        className: clsx(
          "nav-mag-link nav-mag-link--active flex min-w-0 shrink-0 items-center justify-center rounded-full px-2.5 py-1.5 text-center text-xs sm:px-3 sm:py-2 sm:text-sm",
          props.className
        )
      }}
    >
      {props.label}
    </Link>
  );
}

/** Stand-out CTA in the nav — soft pulse + shimmer so new visitors notice Resume. */
function ResumeNavLink(props: { onPick?: () => void; className?: string }) {
  return (
    <Link
      to="/resume"
      onClick={() => props.onPick?.()}
      className={clsx(
        "resume-nav-cta group relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-full px-2.5 py-1.5 text-center text-xs sm:w-auto sm:px-3 sm:py-2 sm:text-sm",
        props.className
      )}
      activeProps={{
        className: clsx(
          "resume-nav-cta-active flex w-full shrink-0 items-center justify-center rounded-full px-2.5 py-1.5 text-center text-xs sm:w-auto sm:px-3 sm:py-2 sm:text-sm",
          props.className
        )
      }}
    >
      <span className="resume-nav-cta__glow pointer-events-none absolute inset-0 rounded-full" aria-hidden />
      <span className="resume-nav-cta__shine pointer-events-none absolute inset-0" aria-hidden />
      <span className="relative z-[1] font-semibold tracking-wide text-slate-100 transition-colors duration-300 group-hover:text-white">
        Resume
      </span>
    </Link>
  );
}

/** QR CTA in navbar (visible outside Tools dropdown). */
function QrNavLink(props: { onPick?: () => void; className?: string }) {
  return (
    <Link
      to="/qr-code"
      onClick={() => props.onPick?.()}
      className={clsx(
        "qr-nav-cta group relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-full px-2.5 py-1.5 text-center text-xs sm:w-auto sm:px-3 sm:py-2 sm:text-sm",
        props.className
      )}
      activeProps={{
        className: clsx(
          "qr-nav-cta-active flex w-full shrink-0 items-center justify-center rounded-full px-2.5 py-1.5 text-center text-xs sm:w-auto sm:px-3 sm:py-2 sm:text-sm",
          props.className
        )
      }}
    >
      <span className="qr-nav-cta__glow pointer-events-none absolute inset-0 rounded-full" aria-hidden />
      <span className="qr-nav-cta__shine pointer-events-none absolute inset-0" aria-hidden />
      <span className="relative z-[1] font-semibold tracking-wide text-slate-100 transition-colors duration-300 group-hover:text-white">
        QR
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    setToolsOpen(false);
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (headerRef.current && !headerRef.current.contains(target)) {
        setToolsOpen(false);
        setMobileNavOpen(false);
        return;
      }
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
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

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  const closeAllNav = () => {
    setMobileNavOpen(false);
    setToolsOpen(false);
  };

  const sheetLink = "nav-mag-link nav-mag-link--sheet";

  return (
    <div className="min-h-screen min-w-0">
      <RouteMetaSync />
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-8">
        <header ref={headerRef} className="relative z-20 md:sticky md:top-4 md:z-30">
          <div className="app-shell premium-nav-wrap flex min-w-0 flex-col gap-3 rounded-2xl p-3 sm:gap-4 sm:rounded-3xl sm:p-4 md:flex-row md:items-center md:justify-between md:px-5">
            <div className="flex min-w-0 w-full items-center justify-between gap-3 md:w-auto md:justify-start">
              <Link
                to="/"
                onClick={() => setMobileNavOpen(false)}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl p-1 transition hover:bg-white/5 sm:flex-initial sm:gap-3"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-200 via-white to-cyan-100 text-slate-900 shadow-lg shadow-indigo-200/20 sm:h-10 sm:w-10 sm:rounded-2xl">
                  <div className="text-[10px] font-bold tracking-wide sm:text-xs">FM</div>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold tracking-tight text-white sm:text-base">
                    File Mitra
                  </div>
                  <div className="truncate text-[10px] leading-tight text-slate-400 sm:text-xs">
                    Premium file utility suite
                  </div>
                </div>
              </Link>

              <button
                type="button"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white md:hidden"
                aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileNavOpen}
                aria-controls="primary-mobile-nav"
                onClick={() => setMobileNavOpen((o) => !o)}
              >
                {mobileNavOpen ? (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>

            <nav
              className={clsx(
                "premium-nav-pill relative hidden w-full min-w-0 md:flex",
                "flex-row flex-wrap items-center justify-center gap-2 rounded-full p-1.5 md:w-auto md:flex-nowrap md:justify-end"
              )}
            >
              <NavLink to="/" label="Home" />
              <NavLink to="/blog" label="Blog" />
              <NavLink to="/how-it-works" label="How it works" />
              <ResumeNavLink />
              <QrNavLink />

              <div ref={dropdownRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setToolsOpen((prev) => !prev)}
                  className="nav-mag-link cursor-pointer list-none rounded-full px-2.5 py-1.5 text-center text-xs sm:px-3 sm:py-2 sm:text-sm"
                >
                  Tools
                </button>
                <div
                  className={`premium-dropdown premium-dropdown-panel absolute right-0 top-full z-40 mt-1 w-64 min-w-0 ${
                    toolsOpen ? "premium-dropdown-open" : ""
                  } `}
                >
                  <div className="px-3 pb-2 pt-3 sm:px-4 sm:pb-3 sm:pt-3.5">
                    <div className="mb-3 pl-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-400 sm:mb-3.5 sm:text-[11px] sm:tracking-[0.2em]">
                      Tool Hubs
                    </div>
                    <div className="grid min-w-0 gap-1">
                      <Link
                        to="/how-it-works"
                        onClick={() => setToolsOpen(false)}
                        className="nav-mag-link nav-mag-link--dropdown flex w-full min-w-0 items-center break-words rounded-xl px-3 py-2.5 text-left text-xs leading-snug sm:rounded-full sm:px-3.5 sm:py-2.5 sm:text-sm"
                      >
                        How it works (usage guide)
                      </Link>
                      <Link
                        to="/image-tools"
                        onClick={() => setToolsOpen(false)}
                        className="nav-mag-link nav-mag-link--dropdown flex w-full min-w-0 items-center break-words rounded-xl px-3 py-2.5 text-left text-xs leading-snug sm:rounded-full sm:px-3.5 sm:py-2.5 sm:text-sm"
                      >
                        Image Tools (Convert + Compress)
                      </Link>
                      <Link
                        to="/pdf-tools"
                        onClick={() => setToolsOpen(false)}
                        className="nav-mag-link nav-mag-link--dropdown flex w-full min-w-0 items-center break-words rounded-xl px-3 py-2.5 text-left text-xs leading-snug sm:rounded-full sm:px-3.5 sm:py-2.5 sm:text-sm"
                      >
                        PDF Tools (Convert + Compress + Merge)
                      </Link>
                      <Link
                        to="/ocr"
                        onClick={() => setToolsOpen(false)}
                        className="nav-mag-link nav-mag-link--dropdown flex w-full min-w-0 items-center break-words rounded-xl px-3 py-2.5 text-left text-xs leading-snug sm:rounded-full sm:px-3.5 sm:py-2.5 sm:text-sm"
                      >
                        OCR Extractor
                      </Link>
                      <Link
                        to="/qr-code"
                        onClick={() => setToolsOpen(false)}
                        className="nav-mag-link nav-mag-link--dropdown flex w-full min-w-0 items-center break-words rounded-xl px-3 py-2.5 text-left text-xs leading-snug sm:rounded-full sm:px-3.5 sm:py-2.5 sm:text-sm"
                      >
                        QR Code Generator
                      </Link>
                      <Link
                        to="/resume"
                        onClick={() => setToolsOpen(false)}
                        className="nav-mag-link nav-mag-link--dropdown flex w-full min-w-0 items-center break-words rounded-xl px-3 py-2.5 text-left text-xs leading-snug sm:rounded-full sm:px-3.5 sm:py-2.5 sm:text-sm"
                      >
                        Resume Studio
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <NavLink to="/about" label="About" />
              <NavLink to="/contact" label="Contact" />
              <NavLink to="/privacy-policy" label="Privacy" />
              <NavLink to="/terms" label="Terms" />
            </nav>
          </div>

          <div
            id="primary-mobile-nav"
            className={clsx(
              "md:hidden overflow-hidden border-t border-white/10 transition-[max-height,opacity] duration-300 ease-out",
              mobileNavOpen
                ? "max-h-[min(72vh,28rem)] opacity-100"
                : "pointer-events-none max-h-0 border-transparent opacity-0"
            )}
          >
            <div className="app-shell premium-nav-wrap mt-2 flex max-h-[min(68vh,26rem)] flex-col gap-1 overflow-y-auto rounded-2xl p-2">
              <NavLink to="/" label="Home" onPick={closeAllNav} className={sheetLink} />
              <NavLink to="/blog" label="Blog" onPick={closeAllNav} className={sheetLink} />
              <NavLink to="/how-it-works" label="How it works" onPick={closeAllNav} className={sheetLink} />
              <ResumeNavLink onPick={closeAllNav} className="!rounded-xl" />
              <QrNavLink onPick={closeAllNav} className="!rounded-xl" />
              <div className="px-2 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Tool hubs
              </div>
              <NavLink
                to="/image-tools"
                label="Image Tools (convert + compress)"
                onPick={closeAllNav}
                className={sheetLink}
              />
              <NavLink
                to="/pdf-tools"
                label="PDF Tools (convert + compress + merge)"
                onPick={closeAllNav}
                className={sheetLink}
              />
              <NavLink to="/ocr" label="OCR Extractor" onPick={closeAllNav} className={sheetLink} />
              <div className="my-1 border-t border-white/10" />
              <NavLink to="/about" label="About" onPick={closeAllNav} className={sheetLink} />
              <NavLink to="/contact" label="Contact" onPick={closeAllNav} className={sheetLink} />
              <NavLink to="/privacy-policy" label="Privacy" onPick={closeAllNav} className={sheetLink} />
              <NavLink to="/terms" label="Terms" onPick={closeAllNav} className={sheetLink} />
            </div>
          </div>
        </header>

        <main className="mt-5 min-w-0 sm:mt-8">
          <Outlet />
        </main>

        <footer className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-indigo-200 via-white to-cyan-100 text-[10px] font-bold text-slate-900">
                  FM
                </span>
                <span>
                  © {new Date().getFullYear()} File Mitra · Fast, private, and simple.
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Link to="/how-it-works" className="hover:text-white">
                How it works
              </Link>
              <Link to="/resume" className="hover:text-white">
                Resume
              </Link>
              <Link to="/blog" className="hover:text-white">
                Blog
              </Link>
              <Link to="/about" className="hover:text-white">
                About
              </Link>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white">
                Terms
              </Link>
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

const qrCodeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/qr-code",
  component: QrCodePage
});

const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage
});

const howItWorksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/how-it-works",
  component: HowItWorksPage
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

const termsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsAndConditionsPage
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
  qrCodeRoute,
  aboutRoute,
  howItWorksRoute,
  contactRoute,
  privacyPolicyRoute,
  termsRoute,
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
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-slate-400">
          Loading…
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}

