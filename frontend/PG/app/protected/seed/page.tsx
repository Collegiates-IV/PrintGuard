"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_PRINTERS, MOCK_ALERTS, MOCK_HISTORY } from "@/lib/mock-data";

export default function SeedPage() {
  const [logs, setLogs] = useState<string[]>(["Ready to seed mock data..."]);
  const [isWorking, setIsWorking] = useState(false);
  const supabase = createClient();

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  async function handleSeed() {
    setIsWorking(true);
    addLog("Starting seeding process...");
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error("You are not logged in! Please go to /auth/login first.");
      }
      
      const { data: orgData, error: orgError } = await supabase
        .from("organizationMembers")
        .select("organizationId")
        .eq("userId", userData.user.id)
        .limit(1)
        .single();
        
      if (orgError || !orgData) {
        throw new Error("Could not find your organization membership.");
      }
      const orgId = orgData.organizationId;
      addLog(`Authenticated. Organization ID: ${orgId}`);

      // Insert labs
      const labs = [...new Set(MOCK_PRINTERS.map(p => p.lab))];
      const labIdMap = new Map<string, string>();
      for (const labName of labs) {
        addLog(`Ensuring lab: ${labName}...`);
        const { data: extLab } = await supabase.from("labs").select("id").eq("organizationId", orgId).eq("name", labName).maybeSingle();
        if (extLab) {
          labIdMap.set(labName, extLab.id);
        } else {
          const { data: newLab, error } = await supabase.from("labs").insert({ name: labName, organizationId: orgId }).select("id").single();
          if (error) {
             addLog(`❌ Error inserting lab ${labName}: ${error.message} (Likely missing INSERT RLS Policy on 'labs')`);
          } else {
             labIdMap.set(labName, newLab.id);
          }
        }
      }

      // Insert Printers
      const printerIdMap = new Map<string, string>();
      for (const mprinter of MOCK_PRINTERS) {
        addLog(`Inserting printer: ${mprinter.name}...`);
        const { data: dbPrinter, error } = await supabase.from("printers").insert({
          organizationId: orgId,
          name: mprinter.name,
          model: mprinter.model,
          status: mprinter.status,
          labId: labIdMap.get(mprinter.lab) || null
        }).select("id").single();
        
        if (error) {
          addLog(`❌ Error inserting printer ${mprinter.name}: ${error.message} (Likely RLS Error)`);
        } else {
          printerIdMap.set(mprinter.id, dbPrinter.id);
        }
      }

      // Insert Alerts
      for (const malert of MOCK_ALERTS) {
        const pid = printerIdMap.get(malert.printerId);
        if (!pid) {
           addLog(`Skipped alert for ${malert.printerName} because printer failed to insert.`);
           continue;
        }
        addLog(`Inserting alert for ${malert.printerName}...`);
        const { error } = await supabase.from("incidents").insert({
          organizationId: orgId,
          printerId: pid,
          incidentStatus: malert.type === "warning" ? "active" : malert.type === "confirmed" ? "active" : "resolved",
          detectionLabel: malert.defect,
          confidence: malert.confidence,
          consecutiveFrames: malert.consecutiveFrames,
          createdAt: malert.timestamp || new Date().toISOString()
        });
        if (error) addLog(`❌ Error inserting alert: ${error.message}`);
      }

      // Insert Print Jobs
      for (const mjob of MOCK_HISTORY) {
        const pid = printerIdMap.get(mjob.printerId);
        if (!pid) {
           addLog(`Skipped job ${mjob.fileName} because printer failed to insert.`);
           continue;
        }
        addLog(`Inserting job: ${mjob.fileName}...`);
        const { error } = await supabase.from("printJobs").insert({
           organizationId: orgId,
           printerId: pid,
           fileName: mjob.fileName,
           jobStatus: mjob.status === "passed" ? "completed" : mjob.status === "failed" ? "failed" : mjob.status === "warned" ? "completed" : mjob.status,
           filamentUsedG: mjob.filamentSavedG || 100,
           estimatedTimeLeftMin: mjob.durationMin,
           filamentSavedG: mjob.filamentSavedG,
           timeSavedMin: mjob.timeSavedMin,
           createdAt: mjob.startedAt || new Date().toISOString()
        });
        if (error) addLog(`❌ Error inserting job: ${error.message}`);
      }

      addLog("Done seeding!");
    } catch (err: any) {
      addLog(`❌ CRITICAL ERROR: ${err.message}`);
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Database Seeder</h1>
        <p className="text-muted-foreground mt-2">
          Click the button below to inject the dummy PrintGuard data into your Supabase profile.
          If there are Row Level Security (RLS) limitations, they will appear below so you can fix them.
        </p>
      </div>

      <button
        onClick={handleSeed}
        disabled={isWorking}
        className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md disabled:opacity-50"
      >
        {isWorking ? "Seeding..." : "Start Seeding & Insert Data"}
      </button>

      <div className="bg-surface-2 border border-border rounded-lg p-4 font-mono text-xs overflow-y-auto max-h-[500px] flex flex-col gap-1">
        {logs.map((log, i) => (
          <div key={i} className={log.includes("❌") ? "text-pg-danger font-semibold" : "text-muted-foreground"}>
            {log}
          </div>
        ))}
      </div>
{logs.some(l => l.includes("RLS Policy") || l.includes("row-level security")) && (
        <div className="mt-6 p-4 border border-pg-warning/50 bg-pg-warning/10 text-pg-warning rounded-md">
          <h3 className="font-bold mb-2">Supabase RLS Detected</h3>
          <p className="text-sm opacity-90 mb-2">You need to run this SQL in your Supabase Dashboard SQL Editor to allow insertions:</p>
          <pre className="text-[10px] bg-background/50 p-3 rounded">
{`CREATE POLICY "org members can insert labs" ON "labs" FOR INSERT WITH CHECK ("organizationId" IN (SELECT "organizationId" FROM "organizationMembers" WHERE "userId" = auth.uid()));
CREATE POLICY "org members can insert printers" ON "printers" FOR INSERT WITH CHECK ("organizationId" IN (SELECT "organizationId" FROM "organizationMembers" WHERE "userId" = auth.uid()));
CREATE POLICY "org members can insert incidents" ON "incidents" FOR INSERT WITH CHECK ("organizationId" IN (SELECT "organizationId" FROM "organizationMembers" WHERE "userId" = auth.uid()));
CREATE POLICY "org members can insert printJobs" ON "printJobs" FOR INSERT WITH CHECK ("organizationId" IN (SELECT "organizationId" FROM "organizationMembers" WHERE "userId" = auth.uid()));`}
          </pre>
        </div>
      )}
    </div>
  );
}
