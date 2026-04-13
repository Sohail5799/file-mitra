import { type ReactNode } from "react";
import clsx from "clsx";

export function Card(props: {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "surface-muted p-4 sm:p-5",
        props.className
      )}
    >
      <div className="text-sm font-semibold tracking-tight text-white">
        {props.title}
      </div>
      {props.description ? (
        <div className="mt-1 text-sm text-slate-300">{props.description}</div>
      ) : null}
      {props.children ? <div className="mt-4">{props.children}</div> : null}
    </div>
  );
}

