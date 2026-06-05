"use client";

import { useSettings, useUpsertSetting, useDeleteSetting } from "@workspace/api-client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

export const GeneralSettingsView = () => {
  const { data: settingsData, isLoading } = useSettings();
  const { mutate: upsertSetting, isPending: isSaving } = useUpsertSetting();
  const { mutate: deleteSetting } = useDeleteSetting();

  // Simple state for a new setting form
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;
    upsertSetting({
      key: newKey,
      value: newValue,
      type: "string",
    });
    setNewKey("");
    setNewValue("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const settings = settingsData?.items || [];

  return (
    <div className="space-y-8">
      <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-on-surface">Existing Settings</h2>
        
        {settings.length === 0 ? (
          <p className="text-on-surface-variant text-sm italic">No settings found.</p>
        ) : (
          <div className="space-y-4">
            {settings.map((setting: any) => (
              <div key={setting.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-variant/30 border border-outline-variant/50">
                <div>
                  <div className="font-semibold text-on-surface">{setting.key}</div>
                  <div className="text-sm text-on-surface-variant mt-1">{setting.value}</div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-error hover:bg-error/10"
                  onClick={() => deleteSetting({ id: setting.id })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-on-surface">Add New Setting</h2>
        <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-medium text-on-surface">Key</label>
            <input 
              type="text" 
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm"
              placeholder="e.g., MAINTENANCE_MODE"
            />
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="text-sm font-medium text-on-surface">Value</label>
            <input 
              type="text" 
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm"
              placeholder="e.g., true"
            />
          </div>
          <Button type="submit" disabled={isSaving || !newKey || !newValue} className="h-10">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Save Setting
          </Button>
        </form>
      </div>
    </div>
  );
};
