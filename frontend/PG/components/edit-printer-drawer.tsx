"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Loader2, AlertCircle, Save, Trash2 } from "lucide-react";
import type { Printer } from "@/lib/mock-data";
import { updatePrinterAction, deletePrinterAction } from "@/app/protected/fleet/actions";

interface EditPrinterDialogProps {
  printer: Printer;
  organizationId: string;
  availableLabs: string[];
}

export function EditPrinterDialog({
  printer,
  organizationId,
  availableLabs,
}: EditPrinterDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (!open) {
      setErrorMsg(null);
      setConfirmDelete(false);
    }
  }, [open]);

  function openDialog() {
    setErrorMsg(null);
    setConfirmDelete(false);
    setOpen(true);
    dialogRef.current?.showModal();
  }

  function closeDialog(force = false) {
    if (isPending && !force) return;
    setOpen(false);
    setErrorMsg(null);
    setConfirmDelete(false);
    dialogRef.current?.close();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      closeDialog();
    }
  }

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updatePrinterAction(formData);
      if (!result.success) {
        setErrorMsg(result.error);
        return;
      }

      closeDialog(true);
      router.refresh();
    });
  }

  function handleDelete() {
    setErrorMsg(null);
    const formData = new FormData();
    formData.set("organizationId", organizationId);
    formData.set("printerId", printer.id);
    startTransition(async () => {
      const result = await deletePrinterAction(formData);
      if (!result.success) {
        setErrorMsg(result.error);
        setConfirmDelete(false);
        return;
      }

      closeDialog(true);
      router.refresh();
    });
  }

  return (
    <>
      {/* Trigger — pencil icon shown on row hover */}
      <button
        type="button"
        onClick={openDialog}
        title="Edit printer"
        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent opacity-0 group-hover:opacity-100 transition-all"
      >
        <Pencil size={13} />
      </button>

      {/* Dialog — same native <dialog> pattern as Add Printer */}
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        onClose={() => closeDialog()}
        className="m-auto w-full max-w-md rounded-xl border border-border bg-card text-foreground shadow-2xl p-0 open:animate-fade-in"
      >
        {open && (
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Edit Printer
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[260px]">
                  {printer.name}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                disabled={isPending}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Inline error */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-lg border border-pg-danger/30 bg-danger-dim px-3 py-2.5">
                <AlertCircle size={14} className="text-pg-danger mt-0.5 shrink-0" />
                <p className="text-xs text-pg-danger leading-relaxed">{errorMsg}</p>
              </div>
            )}

            {/* Edit form */}
            <form onSubmit={handleSave} className="space-y-4">
              <input type="hidden" name="organizationId" value={organizationId} />
              <input type="hidden" name="printerId" value={printer.id} />

              <div className="space-y-1">
                <label
                  htmlFor={`edit-name-${printer.id}`}
                  className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Printer Name <span className="text-destructive">*</span>
                </label>
                <input
                  id={`edit-name-${printer.id}`}
                  name="printerName"
                  type="text"
                  required
                  defaultValue={printer.name}
                  disabled={isPending}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor={`edit-model-${printer.id}`}
                  className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Model
                </label>
                <input
                  id={`edit-model-${printer.id}`}
                  name="printerModel"
                  type="text"
                  defaultValue={printer.model === "Unknown" ? "" : printer.model}
                  placeholder="e.g. Bambu X1 Carbon"
                  disabled={isPending}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor={`edit-lab-${printer.id}`}
                  className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Lab / Group
                </label>
                <input
                  id={`edit-lab-${printer.id}`}
                  name="labName"
                  type="text"
                  list={`edit-lab-list-${printer.id}`}
                  defaultValue={printer.lab === "Unknown Lab" ? "" : printer.lab}
                  placeholder={availableLabs.length > 0 ? `e.g. ${availableLabs[0]}` : "e.g. Lab A"}
                  disabled={isPending}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition"
                />
                {availableLabs.length > 0 && (
                  <datalist id={`edit-lab-list-${printer.id}`}>
                    {availableLabs.map((lab) => (
                      <option key={lab} value={lab} />
                    ))}
                  </datalist>
                )}
                <p className="text-[10px] text-muted-foreground">
                  Change lab to move this printer to a different group
                </p>
              </div>

              {/* Save / Cancel */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeDialog}
                  disabled={isPending}
                  className="flex-1 px-3 py-2 rounded-md border border-border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {isPending && !confirmDelete ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Delete section */}
            <div className="pt-1 border-t border-border space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                Danger Zone
              </p>

              {confirmDelete ? (
                <div className="rounded-lg border border-pg-danger/40 bg-danger-dim p-3 space-y-3">
                  <p className="text-xs text-pg-danger">
                    Permanently delete <strong>{printer.name}</strong>? This cannot be undone.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      disabled={isPending}
                      className="flex-1 px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-pg-danger text-white text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {isPending ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Trash2 size={11} />
                      )}
                      {isPending ? "Deleting…" : "Yes, Delete"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  disabled={isPending}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-md border border-border text-xs text-muted-foreground hover:border-pg-danger/50 hover:text-pg-danger hover:bg-danger-dim transition-colors disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  Delete this printer
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
