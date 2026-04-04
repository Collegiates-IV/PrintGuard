"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProtectedContext } from "@/lib/data/context";
import { MOCK_PRINTERS } from "@/lib/mock-data";

async function ensureOrganizationMember(
  organizationId: string,
  userId: string
): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizationMembers")
    .select("organizationId")
    .eq("organizationId", organizationId)
    .eq("userId", userId)
    .maybeSingle();
  return Boolean(data);
}

async function resolveLabId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  organizationId: string,
  labName: string
): Promise<{ labId: string; error?: never } | { labId?: never; error: string }> {
  const trimmed = labName.trim();

  const { data: existingLabs, error: findError } = await supabase
    .from("labs")
    .select("id")
    .eq("organizationId", organizationId)
    .ilike("name", trimmed)
    .limit(1);

  if (findError) {
    return { error: `Could not look up lab: ${findError.message}` };
  }

  const existingLab = existingLabs?.[0];
  if (existingLab?.id) {
    return { labId: existingLab.id };
  }

  const { data: newLab, error: insertError } = await supabase
    .from("labs")
    .insert({ organizationId, name: trimmed })
    .select("id")
    .single();

  if (insertError || !newLab?.id) {
    const msg = insertError?.message ?? "Unknown error creating lab";
    return {
      error: `Could not create lab "${trimmed}": ${msg}. Check Row Level Security policies on the labs table.`,
    };
  }

  return { labId: newLab.id };
}

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

function revalidateFleetPaths(printerId?: string): void {
  revalidatePath("/protected/fleet");
  revalidatePath("/protected/dashboard");
  revalidatePath("/protected/printers");
  if (printerId) {
    revalidatePath(`/protected/printers/${printerId}`);
  }
}

export async function addPrinterAction(
  formData: FormData
): Promise<ActionResult> {
  const organizationId = String(formData.get("organizationId") ?? "").trim();
  const printerName = String(formData.get("printerName") ?? "").trim();
  const printerModel = String(formData.get("printerModel") ?? "").trim();
  const labName = String(formData.get("labName") ?? "").trim();

  if (!organizationId || !printerName) {
    return { success: false, error: "Printer name and organization are required." };
  }

  const context = await getProtectedContext();
  if (context.isDemoMode || organizationId === "demo-org-123") {
    MOCK_PRINTERS.push({
      id: `demo-${Date.now()}`,
      name: printerName,
      model: printerModel || "Unknown",
      lab: labName || "Unknown Lab",
      status: "idle",
      currentJob: null,
      jobProgress: 0,
      confidence: 0,
      consecutiveFrames: 0,
      detectedLabel: "GOOD",
      lastFrameAt: new Date().toISOString(),
      cameraConnected: false,
      latencyMs: 0,
      filamentUsedG: 0,
      estimatedTimeLeftMin: 0,
    });
    revalidatePath("/demo/fleet");
    revalidatePath("/demo/dashboard");
    return { success: true };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const isMember = await ensureOrganizationMember(organizationId, user.id);
  if (!isMember) return { success: false, error: "You are not a member of this organization." };

  let labId: string | null = null;
  if (labName) {
    const labResult = await resolveLabId(supabase, organizationId, labName);
    if (labResult.error) return { success: false, error: labResult.error };
    labId = labResult.labId ?? null;
  }

  const insertPayload: Record<string, unknown> = {
    organizationId,
    name: printerName,
    status: "idle",
  };
  if (printerModel) insertPayload.model = printerModel;
  if (labId) insertPayload.labId = labId;

  const { error: printerError } = await supabase.from("printers").insert(insertPayload);
  if (printerError) {
    return { success: false, error: `Could not add printer: ${printerError.message}` };
  }

  revalidateFleetPaths();
  return { success: true };
}

export async function updatePrinterAction(
  formData: FormData
): Promise<ActionResult> {
  const organizationId = String(formData.get("organizationId") ?? "").trim();
  const printerId = String(formData.get("printerId") ?? "").trim();
  const printerName = String(formData.get("printerName") ?? "").trim();
  const printerModel = String(formData.get("printerModel") ?? "").trim();
  const labName = String(formData.get("labName") ?? "").trim();

  if (!organizationId || !printerId || !printerName) {
    return { success: false, error: "Printer name is required." };
  }

  const context = await getProtectedContext();
  if (context.isDemoMode || organizationId === "demo-org-123") {
    const printer = MOCK_PRINTERS.find(p => p.id === printerId);
    if (printer) {
      printer.name = printerName;
      if (printerModel) printer.model = printerModel;
      if (labName) printer.lab = labName;
    }
    revalidatePath("/demo/fleet");
    revalidatePath("/demo/dashboard");
    return { success: true };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const isMember = await ensureOrganizationMember(organizationId, user.id);
  if (!isMember) return { success: false, error: "You are not a member of this organization." };

  const { data: existingPrinter, error: printerLookupError } = await supabase
    .from("printers")
    .select("id")
    .eq("organizationId", organizationId)
    .eq("id", printerId)
    .maybeSingle();

  if (printerLookupError) {
    return { success: false, error: `Could not load printer: ${printerLookupError.message}` };
  }
  if (!existingPrinter?.id) {
    return { success: false, error: "Printer not found for this organization." };
  }

  // Resolve lab
  let labId: string | null = null;
  if (labName) {
    const labResult = await resolveLabId(supabase, organizationId, labName);
    if (labResult.error) return { success: false, error: labResult.error };
    labId = labResult.labId ?? null;
  }

  const updatePayload: Record<string, unknown> = {
    name: printerName,
    model: printerModel || null,
    labId: labId,
  };

  const { data: updatedPrinter, error: updateError } = await supabase
    .from("printers")
    .update(updatePayload)
    .select("id")
    .eq("organizationId", organizationId)
    .eq("id", printerId)
    .maybeSingle();

  if (updateError) {
    return { success: false, error: `Could not update printer: ${updateError.message}` };
  }
  if (!updatedPrinter?.id) {
    return { success: false, error: "Printer update did not affect any records." };
  }

  const { error: stationUpdateError } = await supabase
    .from("stations")
    .update({ name: `${printerName} Station` })
    .eq("organizationId", organizationId)
    .eq("printerId", printerId);

  if (stationUpdateError) {
    return {
      success: false,
      error: `Printer was updated, but station name could not be synced: ${stationUpdateError.message}`,
    };
  }

  revalidateFleetPaths(printerId);
  return { success: true };
}

export async function deletePrinterAction(
  formData: FormData
): Promise<ActionResult> {
  const organizationId = String(formData.get("organizationId") ?? "").trim();
  const printerId = String(formData.get("printerId") ?? "").trim();

  if (!organizationId || !printerId) {
    return { success: false, error: "Missing required fields." };
  }

  const context = await getProtectedContext();
  if (context.isDemoMode || organizationId === "demo-org-123") {
    const idx = MOCK_PRINTERS.findIndex(p => p.id === printerId);
    if (idx !== -1) {
      MOCK_PRINTERS.splice(idx, 1);
    }
    revalidatePath("/demo/fleet");
    revalidatePath("/demo/dashboard");
    return { success: true };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const isMember = await ensureOrganizationMember(organizationId, user.id);
  if (!isMember) return { success: false, error: "You are not a member of this organization." };

  const { data: existingPrinter, error: printerLookupError } = await supabase
    .from("printers")
    .select("id")
    .eq("organizationId", organizationId)
    .eq("id", printerId)
    .maybeSingle();

  if (printerLookupError) {
    return { success: false, error: `Could not load printer: ${printerLookupError.message}` };
  }
  if (!existingPrinter?.id) {
    return { success: false, error: "Printer not found for this organization." };
  }

  const { data: stationRows, error: stationLookupError } = await supabase
    .from("stations")
    .select("id")
    .eq("organizationId", organizationId)
    .eq("printerId", printerId);

  if (stationLookupError) {
    return { success: false, error: `Could not load printer stations: ${stationLookupError.message}` };
  }

  const stationIds = (stationRows ?? []).map((row) => row.id).filter(Boolean);
  if (stationIds.length > 0) {
    const { error: deleteStationCamerasError } = await supabase
      .from("stationCameras")
      .delete()
      .eq("organizationId", organizationId)
      .in("stationId", stationIds);

    if (deleteStationCamerasError) {
      return {
        success: false,
        error: `Could not delete printer camera assignments: ${deleteStationCamerasError.message}`,
      };
    }

    const { error: deleteStationsError } = await supabase
      .from("stations")
      .delete()
      .eq("organizationId", organizationId)
      .in("id", stationIds);

    if (deleteStationsError) {
      return {
        success: false,
        error: `Could not delete printer stations: ${deleteStationsError.message}`,
      };
    }
  }

  const { error: deleteIncidentError } = await supabase
    .from("incidents")
    .delete()
    .eq("organizationId", organizationId)
    .eq("printerId", printerId);

  if (deleteIncidentError) {
    return { success: false, error: `Could not delete printer incidents: ${deleteIncidentError.message}` };
  }

  const { error: deletePrintJobsError } = await supabase
    .from("printJobs")
    .delete()
    .eq("organizationId", organizationId)
    .eq("printerId", printerId);

  if (deletePrintJobsError) {
    return { success: false, error: `Could not delete printer history: ${deletePrintJobsError.message}` };
  }

  const { data: deletedPrinter, error: deleteError } = await supabase
    .from("printers")
    .delete()
    .select("id")
    .eq("organizationId", organizationId)
    .eq("id", printerId)
    .maybeSingle();

  if (deleteError) {
    return { success: false, error: `Could not delete printer: ${deleteError.message}` };
  }
  if (!deletedPrinter?.id) {
    return { success: false, error: "Printer delete did not affect any records." };
  }

  revalidateFleetPaths(printerId);
  return { success: true };
}
