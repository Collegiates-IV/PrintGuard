import { MOCK_PRINTERS } from "@/lib/mock-data";
import { AddPrinterDialog } from "@/components/add-printer-dialog";
import { FleetPrinterList } from "@/components/fleet-printer-list";

export const dynamic = "force-dynamic";

export default function DemoFleetPage() {
  const printers = MOCK_PRINTERS;
  const labs = [...new Set(printers.map((p) => p.lab))];

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            Fleet Management (Demo)
          </h1>
          <p className="text-sm text-muted-foreground">
            {printers.length} {printers.length === 1 ? "printer" : "printers"} across{" "}
            {labs.length} {labs.length === 1 ? "lab" : "labs"}
          </p>
        </div>
        <AddPrinterDialog
          organizationId="demo-org-123"
          existingLabs={labs}
        />
      </div>

      <FleetPrinterList
        printers={printers}
        organizationId="demo-org-123"
        availableLabs={labs}
        basePath="/demo"
      />
    </div>
  );
}
