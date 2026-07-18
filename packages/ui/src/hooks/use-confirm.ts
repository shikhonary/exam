import { useCallback } from "react";

interface ConfirmProps {
  title?: string;
  body?: string;
}

export function useConfirm() {
  const confirm = useCallback(async ({ title, body }: ConfirmProps = {}) => {
    // A simple window.confirm implementation. 
    // In a real app, this could be upgraded to use the AlertDialog component.
    const message = [title, body].filter(Boolean).join("\n\n");
    return window.confirm(message || "Are you sure?");
  }, []);

  return { confirm };
}
