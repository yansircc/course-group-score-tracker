import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

function generateClientId() {
  return `client_${Math.random().toString(36).substring(2)}`;
}

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

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
        // Clear local storage
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("clientId");
        // Reset admin state
        setIsAdmin(false);
        // Reload the page to reset all state
        window.location.reload();
      } else {
        console.error("Failed to reset:", data.message);
      }
    } catch (error) {
      console.error("Failed to reset data:", error);
    }
  }, [isAdmin]);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        // Get or create clientId
        let clientId = localStorage.getItem("clientId");
        if (!clientId) {
          clientId = generateClientId();
          localStorage.setItem("clientId", clientId);
        }

        // Check if user parameter is admin
        const isAdminParam = searchParams.get("user") === "admin";

        if (isAdminParam) {
          // Register as admin
          await fetch("/api/admin/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId }),
          });
          localStorage.setItem("isAdmin", "true");
          setIsAdmin(true);
        } else {
          // Check existing admin status
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
  }, [searchParams]);

  return { isAdmin, isLoading, resetAll };
}
