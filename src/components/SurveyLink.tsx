"use client";

import type { MouseEvent, ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * Scrolls to the survey without adding "#survey" to the address bar.
 * (href stays as a fallback for when JavaScript hasn't loaded yet.)
 */
export default function SurveyLink({ className, children }: Props) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const survey = document.getElementById("survey");
    if (!survey) return;
    e.preventDefault();
    survey.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <a className={className} href="#survey" onClick={onClick}>
      {children}
    </a>
  );
}
