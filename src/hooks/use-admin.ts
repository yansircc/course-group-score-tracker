"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";

function generateClientId() {
  return `client_${Math.random().toString(36).substring(2)}`;
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Add reset function
  const resetAll = useCallback(async () => {
    const clientId = localStorage.getItem("clientId");
    if (!clientId || !isAdmin) return;

    try {
      const response = await fetch(`/api/killall?clientId=${clientId}`, {
        method: "POST",
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (data.success) {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("clientId");
        setIsAdmin(false);
        window.location.reload();
      } else {
        console.error("Failed to reset:", data.message);
      }
    } catch (error) {
      console.error("Failed to reset data:", error);
    }
  }, [isAdmin]);

  useEffect(() => {
    startTransition(() => {
      async function checkAdminStatus() {
        try {
          let clientId = localStorage.getItem("clientId");
          if (!clientId) {
            clientId = generateClientId();
            localStorage.setItem("clientId", clientId);
          }

          const isAdminParam = searchParams.get("user") === "admin";

          if (isAdminParam) {
            await fetch("/api/admin/check", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ clientId }),
            });
            localStorage.setItem("isAdmin", "true");
            setIsAdmin(true);
          } else {
            const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
            if (storedIsAdmin) {
              const response = await fetch(
                `/api/admin/check?clientId=${clientId}`,
              );
              const data = (await response.json()) as { isAdmin: boolean };
              setIsAdmin(data.isAdmin);
              if (!data.isAdmin) {
                localStorage.removeItem("isAdmin");
              }
            }
          }
        } catch (error) {
          console.error("Failed to check admin status:", error);
        } finally {
          setIsLoading(false);
        }
      }

      void checkAdminStatus();
    });
  }, [searchParams]);

  return {
    isAdmin,
    isLoading: isLoading || isPending,
    resetAll,
  };
}
