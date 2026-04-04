import { SidebarNav } from "@/components/sidebar-nav";
import { TopStatusBar } from "@/components/top-status-bar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { ConnectivityBanner } from "@/components/connectivity-banner";
import { ProtectedDataRefresh } from "@/components/protected-data-refresh";
import { getProtectedContext } from "@/lib/data/context";
import { loadRealPrinters } from "@/lib/data/real-data";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isDemoBypass = cookieStore.get("demo_bypass")?.value === "true";
  if (isDemoBypass) {
    redirect("/demo/dashboard");
  }

  const context = await getProtectedContext();
  if (context.isDemoMode) {
    redirect("/demo/dashboard");
  }

  if (!context.userId) {
    redirect("/auth/login");
  }

  if (context.memberships.length > 1 && !context.activeOrganizationId && !context.isDemoMode) {
    redirect("/protected/select-org");
  }

  // Fetch live active alert count for the sidebar badge.
  // Only active (warning + confirmed) incidents count — resolved do not.
  let activeAlertCount = 0;
  if (context.activeOrganizationId) {
    const { recentAlerts } = await loadRealPrinters(
      context.supabase,
      context.activeOrganizationId
    );
    activeAlertCount = recentAlerts.filter(
      (a) => a.type === "warning" || a.type === "confirmed"
    ).length;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SidebarNav
        userDisplayName={context.userDisplayName}
        organizationName={context.activeOrganizationName}
        userInitials={context.userInitials}
        activeAlertCount={activeAlertCount}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProtectedDataRefresh />
        <TopStatusBar
          activeOrganizationName={context.activeOrganizationName}
          dataMode={context.dataMode}
          userInitials={context.userInitials}
        />
        <ConnectivityBanner />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
