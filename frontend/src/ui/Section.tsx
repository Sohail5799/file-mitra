import { type ReactNode } from "react";
import clsx from "clsx";

export function Section(props: {
  title: string;
  description?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "surface relative overflow-hidden p-6",
        props.className
      )}
    >
      <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {props.title}
          </h2>
          {props.description ? (
            <p className="mt-1 text-sm text-slate-300">{props.description}</p>
          ) : null}
        </div>
        {props.right ? <div>{props.right}</div> : null}
      </header>

      <div className="mt-5">{props.children}</div>
    </section>
  );
}

