import { Bell, Clock, Filter, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { IncidentEvidenceCard } from "@/components/incident-evidence-card";
import { MOCK_ALERTS } from "@/lib/mock-data";

export default function DemoAlertsPage() {
  const activeAlerts = MOCK_ALERTS.filter((alert) => alert.type === "warning" || alert.type === "confirmed");
  const resolvedAlerts = MOCK_ALERTS.filter((alert) => alert.type === "resolved");

  const fetchedAt = new Date();
  const fetchedLabel = fetchedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="animate-fade-in">
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <h1 className="text-lg font-bold text-foreground tracking-tight">Alert Center (Demo)</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Live incident queue for Demo Organization
        </p>
      </div>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center gap-3">
        <button className="flex items-center gap-2 text-xs font-medium text-foreground bg-surface-2 hover:bg-surface-3 border border-border rounded-md px-3 py-1.5 transition-colors">
          <Filter size={13} />
          All Alerts
        </button>
        <button className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 rounded-md px-3 py-1.5 transition-colors hidden sm:flex">
          <CheckCircle2 size={13} />
          Needs Review
        </button>
        <div className="ml-auto">
          <button className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 border border-transparent hover:border-border rounded-md px-3 py-1.5 transition-colors">
            <SlidersHorizontal size={13} />
            Sort: Newest
          </button>
        </div>
      </div>

      <div className="px-6 py-8 space-y-12">
        <section id="active">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-foreground">Active Incidents</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Warnings and confirmed failures that still need operator review
            </p>
          </div>
          {activeAlerts.length === 0 ? (
            <EmptyState
              icon={<Bell size={28} />}
              title="No active incidents"
              description="Warnings and confirmed failures will appear here as detections are recorded."
              action={
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
                  <Clock size={11} />
                  Last synced {fetchedLabel}
                </span>
              }
            />
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeAlerts.map((alert) => (
                <IncidentEvidenceCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </section>

        <section id="resolved">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-foreground">Resolved</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recent incidents already marked as resolved
            </p>
          </div>
          {resolvedAlerts.length === 0 ? (
            <div className="text-sm text-muted-foreground">No resolved incidents yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {resolvedAlerts.map((alert) => (
                <IncidentEvidenceCard key={alert.id} alert={alert} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
