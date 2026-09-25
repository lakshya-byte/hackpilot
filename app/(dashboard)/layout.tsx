import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import PlanProvider from "@/components/billing/plan-provider";
import ToastProvider from "@/components/shared/toast";

export const metadata: Metadata = {
  title: "Dashboard — HackPilot",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <PlanProvider>
        <DashboardShell>{children}</DashboardShell>
      </PlanProvider>
    </ToastProvider>
  );
}
