"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Settings, ShieldAlert, BellRing } from "lucide-react";
import { GeneralSettingsView } from "./general-settings-view";
import { AuditLogsView } from "./audit-logs-view";
import { NotificationsView } from "./notifications-view";

export const SettingsLayoutView = () => {
  return (
    <div className="min-h-screen bg-surface relative isolate pb-20">
      {/* Background blobs for depth */}
      <div
        aria-hidden
        className="absolute top-[10%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[20%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none"
      />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="relative flex flex-col justify-start items-start mb-8">
          <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              System Settings
            </h1>
            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />
            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              Manage global configuration, track system events, and broadcast notifications.
            </p>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full mt-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-8 bg-surface-variant/30 p-1.5 rounded-xl border border-outline-variant/30 h-auto">
            <TabsTrigger 
              value="general" 
              className="py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="audit-logs" 
              className="py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <ShieldAlert className="w-4 h-4" />
              Audit Logs
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="py-3 px-4 rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all flex items-center justify-center gap-2 font-semibold"
            >
              <BellRing className="w-4 h-4" />
              Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="animate-in fade-in zoom-in-95 duration-500 ring-offset-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <GeneralSettingsView />
          </TabsContent>
          
          <TabsContent value="audit-logs" className="animate-in fade-in zoom-in-95 duration-500 ring-offset-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0">
            <AuditLogsView />
          </TabsContent>
          
          <TabsContent value="notifications" className="animate-in fade-in zoom-in-95 duration-500 ring-offset-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0">
            <NotificationsView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
