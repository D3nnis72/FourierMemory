import { PropsWithChildren } from "react";
import clsx from "clsx";

type CardProps = {
  className?: string;
};

export function Card({ className, children }: PropsWithChildren<CardProps>) {
  return <div className={clsx("rounded-2xl bg-white/5 p-4 card-glow", className)}>{children}</div>;
}

