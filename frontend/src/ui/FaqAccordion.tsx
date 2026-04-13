import { useId, useState } from "react";
import type { FaqItem } from "../content/blogFaq";

export function FaqAccordion(props: { items: FaqItem[]; className?: string }) {
  const baseId = useId();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div
      className={
        props.className ??
        "divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-black/20"
      }
    >
      {props.items.map((item, i) => {
        const expanded = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const headerId = `${baseId}-header-${i}`;
        return (
          <div key={headerId} className="bg-slate-950/20">
            <button
              type="button"
              id={headerId}
              aria-expanded={expanded}
              aria-controls={panelId}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-white transition hover:bg-white/5 sm:px-5 sm:py-4 sm:text-base"
              onClick={() => setOpen(expanded ? null : i)}
            >
              <span className="min-w-0">{item.question}</span>
              <span
                className="shrink-0 text-slate-400 tabular-nums"
                aria-hidden
              >
                {expanded ? "−" : "+"}
              </span>
            </button>
            {expanded ? (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className="border-t border-white/5 px-4 pb-4 pt-1 text-sm leading-relaxed text-slate-300 sm:px-5"
              >
                {item.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
