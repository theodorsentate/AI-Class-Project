import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input(props, ref) {
    return (
      <input
        {...props}
        ref={ref}
        className={cn(
          "min-h-11 w-full rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-3 text-base",
          props.className,
        )}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea(props, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        className={cn(
          "w-full rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-3 text-base",
          props.className,
        )}
      />
    );
  },
);

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "min-h-11 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-3",
        props.className,
      )}
    />
  );
}

export function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} type="checkbox" className={cn("size-5", props.className)} />;
}
