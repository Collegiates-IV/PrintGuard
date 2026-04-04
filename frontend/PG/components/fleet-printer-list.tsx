"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, CameraOff, Search } from "lucide-react";
import type { Printer } from "@/lib/mock-data";
import { StatusBadge } from "@/components/ui/status-badge";
import { EditPrinterDialog } from "@/components/edit-printer-drawer";
import { formatRelativeTime } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface FleetPrinterListProps {
  printers: Printer[];
  organizationId: string;
  availableLabs: string[];
  basePath?: string;
}

export function FleetPrinterList({
  printers,
  organizationId,
  availableLabs,
  basePath = "/protected",
}: FleetPrinterListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPrinters = printers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.model && p.model.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const labs = [...new Set(filteredPrinters.map((p) => p.lab))];

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Search exactly what printer you need..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-surface-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
        />
      </div>
      {labs.map((lab) => {
        const labPrinters = filteredPrinters.filter((p) => p.lab === lab);
        if (labPrinters.length === 0) return null;
        
        return (
          <section key={lab} className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {lab}
              <span className="ml-2 text-xs font-normal normal-case text-muted-foreground/60">
                {labPrinters.length}{" "}
                {labPrinters.length === 1 ? "printer" : "printers"}
              </span>
            </h2>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[1fr_120px_90px_120px_110px] gap-4 px-4 py-2.5 border-b border-border bg-surface-2 text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
                <span>Printer</span>
                <span>Status</span>
                <span className="flex items-center gap-1">
                  <Camera size={10} />
                  Camera
                </span>
                <span>Telemetry</span>
                <span>Actions</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border">
                {labPrinters.map((printer) => (
                  <div
                    key={printer.id}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_120px_90px_120px_110px] gap-2 sm:gap-4 px-4 py-3.5 hover:bg-surface-2 transition-colors group"
                  >
                    {/* Name + model */}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {printer.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {printer.model}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="self-center">
                      <StatusBadge status={printer.status} size="sm" />
                    </div>

                    {/* Camera */}
                    <div className="self-center flex items-center gap-1.5">
                      {printer.cameraConnected ? (
                        <Camera size={13} className="text-pg-healthy" />
                      ) : (
                        <CameraOff size={13} className="text-pg-offline" />
                      )}
                      <span
                        className={cn(
                          "text-[11px]",
                          printer.cameraConnected
                            ? "text-pg-healthy"
                            : "text-pg-offline"
                        )}
                      >
                        {printer.cameraConnected ? "OK" : "Off"}
                      </span>
                    </div>

                    {/* Last frame */}
                    <p className="text-[11px] text-muted-foreground self-center">
                      Last ping {formatRelativeTime(printer.lastFrameAt)}
                    </p>

                    {/* Actions — Monitor link + Edit dialog trigger */}
                    <div className="self-center flex items-center gap-3">
                      <Link
                        href={`${basePath}/printers/${printer.id}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Monitor →
                      </Link>
                      {/* EditPrinterDialog renders its own trigger button */}
                      <EditPrinterDialog
                        printer={printer}
                        organizationId={organizationId}
                        availableLabs={availableLabs}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {filteredPrinters.length === 0 && (
        <div className="text-center py-16 text-sm text-muted-foreground">
          No printers found matching your search.
        </div>
      )}
    </div>
  );
}
