"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, AlertCircle } from "lucide-react";
import { addPrinterAction } from "@/app/protected/fleet/actions";

interface AddPrinterDialogProps {
  organizationId: string;
  existingLabs: string[];
}

export function AddPrinterDialog({
  organizationId,
  existingLabs,
}: AddPrinterDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function openDialog() {
    setErrorMsg(null);
    setOpen(true);
    dialogRef.current?.showModal();
  }

  function closeDialog(force = false) {
    if (isPending && !force) return;
    setOpen(false);
    setErrorMsg(null);
    dialogRef.current?.close();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      closeDialog();
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addPrinterAction(formData);
      if (!result.success) {
        setErrorMsg(result.error);
        return;
      }

      formRef.current?.reset();
      closeDialog(true);
      router.refresh();
    });
  }

  return (
    <>
      <button
        id="add-printer-btn"
        onClick={openDialog}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus size={14} />
        Add Printer
      </button>

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
                  Add Printer
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Register a new printer to your fleet
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

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <input
                type="hidden"
                name="organizationId"
                value={organizationId}
              />

              <div className="space-y-1">
                <label
                  htmlFor="printerName"
                  className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Printer Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="printerName"
                  name="printerName"
                  type="text"
                  required
                  placeholder="e.g. Ultimaker S5 #3"
                  disabled={isPending}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="printerModel"
                  className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Model
                </label>
                <input
                  id="printerModel"
                  name="printerModel"
                  type="text"
                  placeholder="e.g. Bambu X1 Carbon"
                  disabled={isPending}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="labName"
                  className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide"
                >
                  Lab
                </label>
                <input
                  id="labName"
                  name="labName"
                  type="text"
                  list="lab-suggestions"
                  placeholder={
                    existingLabs.length > 0
                      ? `e.g. ${existingLabs[0]}`
                      : "e.g. Lab A"
                  }
                  disabled={isPending}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 transition"
                />
                {existingLabs.length > 0 && (
                  <datalist id="lab-suggestions">
                    {existingLabs.map((lab) => (
                      <option key={lab} value={lab} />
                    ))}
                  </datalist>
                )}
                <p className="text-[10px] text-muted-foreground">
                  {existingLabs.length > 0
                    ? "Select an existing lab or type a new name to create one"
                    : "Enter a lab name to assign this printer to a lab"}
                </p>
              </div>

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
                  id="add-printer-submit-btn"
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Adding…
                    </>
                  ) : (
                    <>
                      <Plus size={13} />
                      Add Printer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </dialog>
    </>
  );
}
