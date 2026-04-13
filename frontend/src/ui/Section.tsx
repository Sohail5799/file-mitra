import { type ReactNode } from "react";
import clsx from "clsx";

export function Section(props: {
  title?: string;
  description?: string;
  /** Use `1` for the main page heading (SEO). Default `2`. */
  titleLevel?: 1 | 2;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const level = props.titleLevel ?? 2;
  const TitleTag = level === 1 ? "h1" : "h2";
  const showHeader = Boolean(props.title || props.description || props.right);

  return (
    <section
      className={clsx(
        "surface relative overflow-hidden p-4 sm:p-6",
        props.className
      )}
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      {showHeader ? (
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            {props.title ? (
              <TitleTag className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                {props.title}
              </TitleTag>
            ) : null}
            {props.description ? (
              <p
                className={clsx(
                  "text-xs leading-relaxed text-slate-300 sm:text-sm",
                  props.title ? "mt-1" : ""
                )}
              >
                {props.description}
              </p>
            ) : null}
          </div>
          {props.right ? <div>{props.right}</div> : null}
        </header>
      ) : null}

      {props.children != null && props.children !== false ? (
        <div className={showHeader ? "mt-5" : ""}>{props.children}</div>
      ) : null}
    </section>
  );
}

