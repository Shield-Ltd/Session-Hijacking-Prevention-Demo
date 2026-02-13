"use client";

import { toast } from "sonner";
import { useEffect } from "react";

type ErrorAlertProps = {
  error: string | null;
  title?: string;
};

function ErrorAlert({ error, title = "Error" }: ErrorAlertProps) {
  useEffect(() => {
    if (error) {
      toast.error(title, {
        description: error,
        duration: 4000,
      });
    }
  }, [error, title]);

  return null;
}

export { ErrorAlert };
