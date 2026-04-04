import { redirect } from "next/navigation";
import { getProtectedContext } from "@/lib/data/context";
import { loadRealPrinters } from "@/lib/data/real-data";
import { AddPrinterDialog } from "@/components/add-printer-dialog";
import { FleetPrinterList } from "@/components/fleet-printer-list";

export default async function FleetPage() {
  const context = await getProtectedContext();
  if (context.isDemoMode) {
    redirect("/demo/fleet");
  }
  if (!context.activeOrganizationId) {
    redirect("/protected/select-org");
  }

  const { printers } = await loadRealPrinters(
    context.supabase,
    context.activeOrganizationId
  );

  // Fetch all labs for this org so the edit/add forms can offer autocomplete
  const { data: labRows } = await context.supabase
    .from("labs")
    .select("name")
    .eq("organizationId", context.activeOrganizationId)
    .order("name", { ascending: true });

  const availableLabs: string[] = (labRows ?? [])
    .map((r: { name: string | null }) => r.name ?? "")
    .filter(Boolean);

  // Also include any lab names that come from printers but aren't in the labs table yet
  const printerLabNames = [...new Set(printers.map((p) => p.lab))].filter(
    (l) => l !== "Unknown Lab" && !availableLabs.includes(l)
  );
  const allLabs = [...availableLabs, ...printerLabNames].sort();

  const labs = [...new Set(printers.map((p) => p.lab))];

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            Fleet Management
          </h1>
          <p className="text-sm text-muted-foreground">
            {printers.length} {printers.length === 1 ? "printer" : "printers"} across{" "}
            {labs.length} {labs.length === 1 ? "lab" : "labs"}
          </p>
        </div>
        <AddPrinterDialog
          organizationId={context.activeOrganizationId!}
          existingLabs={allLabs}
        />
      </div>

      {/* Printer list — client component that manages the edit drawer */}
      <FleetPrinterList
        printers={printers}
        organizationId={context.activeOrganizationId!}
        availableLabs={allLabs}
      />
    </div>
  );
}
