import type { CSSProperties, FocusEvent, MouseEvent } from "react";

/**
 * Inline styles cannot express :hover / :focus. These helpers apply the
 * interactive style straight onto the element (no re-render) and restore the
 * base inline values afterwards.
 */
const UNITLESS = new Set([
  "opacity",
  "zIndex",
  "fontWeight",
  "lineHeight",
  "flex",
  "flexGrow",
  "flexShrink",
  "order",
]);

function apply(el: HTMLElement, style: CSSProperties) {
  const target = el.style as unknown as Record<string, string>;
  for (const [key, value] of Object.entries(style)) {
    target[key] =
      value === undefined || value === null
        ? ""
        : typeof value === "number" && !UNITLESS.has(key)
          ? `${value}px`
          : String(value);
  }
}

export function hoverStyle(
  hover: CSSProperties,
  base: CSSProperties,
  skipWhenDisabled = false,
) {
  return {
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      if (
        skipWhenDisabled &&
        (event.currentTarget as HTMLButtonElement).disabled
      )
        return;
      apply(event.currentTarget, hover);
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      if (
        skipWhenDisabled &&
        (event.currentTarget as HTMLButtonElement).disabled
      )
        return;
      apply(event.currentTarget, base);
    },
  };
}

export function focusStyle(
  focus: CSSProperties,
  base: CSSProperties,
  keyboardOnly = false,
) {
  return {
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (keyboardOnly && !event.currentTarget.matches(":focus-visible"))
        return;
      apply(event.currentTarget, focus);
    },
    onBlur: (event: FocusEvent<HTMLElement>) =>
      apply(event.currentTarget, base),
  };
}
