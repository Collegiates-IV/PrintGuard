import { History, Clock3, Filter, SlidersHorizontal, CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { formatRelativeTime, MOCK_HISTORY } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusLabelByKey: Record<string, string> = {
  running: "Running",
  queued: "Queued",
  completed: "Completed",
  failed: "Failed",
  canceled: "Canceled",
};

export default function DemoHistoryPage() {
  const jobs = MOCK_HISTORY;
  const completedCount = jobs.filter((job) => job.status === "passed").length;
  const failedCount = jobs.filter((job) => job.status === "failed").length;

  return (
    <div className="animate-fade-in">
      <div className="px-6 pt-6 pb-4 border-b border-border">
        <h1 className="text-lg font-bold text-foreground tracking-tight">Print History (Demo)</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Recent print job activity for Demo Organization
        </p>
      </div>

      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-3 flex items-center gap-3">
        <button className="flex items-center gap-2 text-xs font-medium text-foreground bg-surface-2 hover:bg-surface-3 border border-border rounded-md px-3 py-1.5 transition-colors">
          <Filter size={13} />
          All Jobs
        </button>
        <button className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 rounded-md px-3 py-1.5 transition-colors hidden sm:flex">
          <CalendarDays size={13} />
          Last 7 Days
        </button>
        <div className="ml-auto">
          <button className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-surface-2 border border-transparent hover:border-border rounded-md px-3 py-1.5 transition-colors">
            <SlidersHorizontal size={13} />
            Sort: Newest
          </button>
        </div>
      </div>

      <div className="px-6 py-8 space-y-12">
        <section id="recent">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-foreground">Recent Jobs</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest queue and completion activity
            </p>
          </div>
          {jobs.length === 0 ? (
            <EmptyState
              icon={<History size={32} />}
              title="No print history yet"
              description="Completed print jobs will appear here once printers begin reporting jobs."
            />
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="divide-y divide-border">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="px-4 py-3.5 hover:bg-surface-2 transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {job.fileName ?? "Untitled Job"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatRelativeTime(job.startedAt)} · {job.printerName}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-semibold px-2 py-0.5 rounded border shrink-0",
                        job.status === "passed"
                          ? "text-pg-healthy bg-healthy-dim border-pg-healthy/20"
                          : job.status === "failed"
                            ? "text-pg-danger bg-danger-dim border-pg-danger/20"
                            : "text-muted-foreground bg-muted border-border"
                      )}
                    >
                      {statusLabelByKey[job.status === "passed" ? "completed" : job.status] ?? (job.status === "passed" ? "Completed" : job.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section id="summary">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-foreground">Summary</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fast health readout from recent print history
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium">
                <History size={13} />
                Total Jobs
              </div>
              <p className="text-2xl font-bold text-foreground mt-2 tabular-nums">{jobs.length}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium">
                <Clock3 size={13} />
                Completed
              </div>
              <p className="text-2xl font-bold text-pg-healthy mt-2 tabular-nums">{completedCount}</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide font-medium">
                <Clock3 size={13} />
                Failed
              </div>
              <p className="text-2xl font-bold text-pg-danger mt-2 tabular-nums">{failedCount}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
