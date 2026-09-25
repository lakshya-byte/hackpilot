"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "./plan-provider";
import { useToast } from "@/components/shared/toast";
import type { CreateOrderResult } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  theme?: { color: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const CHECKOUT_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadCheckoutScript(): Promise<void> {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("failed to load Razorpay checkout")));
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

// Shared by the pricing card's "Upgrade to Pro" button and the billing
// page's "Renew Pro" button — both drive the exact same create-order ->
// Razorpay Checkout -> verify-payment sequence.
export function useUpgradeFlow() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const { refresh } = usePlan();
  const { showToast } = useToast();
  const router = useRouter();

  const startUpgrade = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      await loadCheckoutScript();

      const orderRes = await fetch("/api/billing/create-order", { method: "POST" });
      const order = (await orderRes.json()) as CreateOrderResult & { error?: string };
      if (!orderRes.ok) {
        throw new Error(order.error || "could not start checkout");
      }

      const razorpay = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "HackPilot",
        description: "HackPilot Pro — 30 days",
        theme: { color: "#3525cd" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/billing/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "payment verification failed");
            }

            setStatus("success");
            refresh();
            showToast("You're now Pro!");
            setTimeout(() => router.push("/billing"), 2000);
          } catch (err) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "payment verification failed");
          }
        },
        modal: {
          ondismiss: () => setStatus("idle"),
        },
      });

      razorpay.open();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "could not start checkout");
    }
  }, [refresh, router, showToast]);

  return { startUpgrade, status, error };
}
