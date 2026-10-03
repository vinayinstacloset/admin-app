import { useEffect, type RefObject } from "react";

// Calls `handler` when a mousedown lands outside `ref` (used by dropdowns).
export function useClickOutside(ref: RefObject<HTMLElement | null>, handler: () => void, enabled = true) {
    useEffect(() => {
        if (!enabled) return;

        const onMouseDown = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, [ref, handler, enabled]);
}
