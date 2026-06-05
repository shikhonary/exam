"use client";

import { useNotifications, useCreateNotification } from "@workspace/api-client";
import { Loader2, Plus, Bell } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

export const NotificationsView = () => {
  const { data: notifData, isLoading } = useNotifications();
  const { mutate: createNotif, isPending } = useCreateNotification();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    createNotif({
      title,
      message,
      type: "info",
    });
    setTitle("");
    setMessage("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const notifications = notifData?.items || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold mb-6 text-on-surface">System Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-on-surface-variant text-sm italic">No notifications found.</p>
        ) : (
          notifications.map((n: any) => (
            <div key={n.id} className="p-4 rounded-xl border border-outline-variant bg-surface flex gap-4 shadow-sm items-start">
              <div className="mt-1 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bell className="w-5 h-5" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-on-surface">{n.title}</h4>
                <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{n.message}</p>
                <div className="text-xs text-on-surface-variant/70 mt-3 font-medium">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm sticky top-8">
          <h3 className="font-bold text-on-surface mb-4">Broadcast Notification</h3>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm"
                placeholder="Notification Title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-24 p-3 rounded-lg border border-outline-variant bg-surface text-sm resize-none"
                placeholder="Write the message here..."
              />
            </div>
            <Button type="submit" disabled={isPending || !title || !message} className="w-full">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Send Broadcast
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
