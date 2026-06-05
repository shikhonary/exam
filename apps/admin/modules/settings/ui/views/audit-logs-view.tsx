"use client";

import { useAuditLogs, useAuditLogFilters } from "@workspace/api-client";
import { Loader2, User } from "lucide-react";
import { AuditLogPagination } from "../components/audit-log-pagination";

export const AuditLogsView = () => {
  const [filters] = useAuditLogFilters();
  const { data: logsData, isLoading } = useAuditLogs(filters);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const logs = logsData?.items || [];
  const total = logsData?.total || 0;

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm flex flex-col">
      <div className="p-6 border-b border-outline-variant/50">
        <h2 className="text-xl font-bold text-on-surface">System Audit Logs</h2>
        <p className="text-sm text-on-surface-variant mt-1">Track system events and actions over time.</p>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-on-surface-variant uppercase bg-surface-variant/30 border-b border-outline-variant">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Action</th>
              <th className="px-6 py-4 font-semibold">Entity & ID</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log.id} className="border-b border-outline-variant/50 hover:bg-surface-variant/10 transition-colors">
                <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {log.user ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface">{log.user.name || "Unknown User"}</span>
                        <span className="text-xs text-on-surface-variant">{log.user.email}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-on-surface-variant italic">
                      <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center">
                        <User className="w-4 h-4 opacity-50" />
                      </div>
                      System / Unknown
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-on-surface">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-on-surface font-semibold">{log.entity}</span>
                    <span className="text-on-surface-variant font-mono text-[10px] mt-0.5">{log.entityId || "-"}</span>
                  </div>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant italic">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <AuditLogPagination totalItem={total} />
    </div>
  );
};
