import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { navigate } from "./navigation";
export default function Link({ href, children, onClick, ...rest }: { href: string; children?: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const h = href.startsWith("#") ? href : "#" + href;
  return (
    <a
      href={h}
      {...rest}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        navigate(href.replace(/^#/, ""));
      }}
    >
      {children}
    </a>
  );
}
