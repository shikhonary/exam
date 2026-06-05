"use client";

import React, { useState } from "react";
import { Bell, ChevronDown, Search, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Skeleton } from "@workspace/ui/components/skeleton";

import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from "@workspace/api-client";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

// ─── Notification type icon ────────────────────────────────────────────────
function NotifIcon({ type }: { type: string }) {
  switch (type) {
    case "success":
      return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
    case "error":
      return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
    default:
      return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
  }
}

// ─── Notifications Panel ───────────────────────────────────────────────────
function NotificationsPanel() {
  const { data: notifData, isLoading } = useNotifications({ limit: 20 });
  const { mutate: markRead } = useMarkNotificationAsRead();
  const { mutate: markAllRead } = useMarkAllNotificationsAsRead();
  const { mutate: deleteNotif } = useDeleteNotification();
  // NOTE: markAllAsRead requires userId — will be replaced with real session once auth is wired
  const ADMIN_USER_ID = "";

  const notifications: any[] = (notifData as any)?.items ?? [];
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <div>
          <p className="text-sm font-bold text-foreground">Notifications</p>
          {unread > 0 && (
            <p className="text-[11px] text-muted-foreground">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllRead({ userId: ADMIN_USER_ID })}
            className="h-7 text-xs text-muted-foreground hover:text-primary gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      {/* List */}
      <ScrollArea className="flex-1 max-h-[380px]">
        {isLoading ? (
          <div className="p-3 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 p-2">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-2.5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
            <Bell className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs opacity-60 mt-0.5">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="p-2 space-y-0.5">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 p-3 rounded-xl group transition-colors cursor-pointer ${
                  !notif.read ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/40"
                }`}
                onClick={() => !notif.read && markRead({ id: notif.id })}
              >
                <NotifIcon type={notif.type} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${!notif.read ? "font-semibold text-foreground" : "text-foreground/80"}`}>
                    {notif.title}
                  </p>
                  {notif.message && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotif({ id: notif.id });
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────
const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: notifData } = useNotifications({ limit: 20 });
  const unreadCount = ((notifData as any)?.items ?? []).filter((n: any) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur-xl border-b border-border/40 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between px-6 lg:px-8 py-3">
        {/* Left: Title */}
        <div className="min-w-0 flex-1 pl-12 lg:pl-0">
          <div className="flex flex-col">
            <h1 className="font-display text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60 truncate tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground font-medium mt-0.5 truncate flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Search - Hidden on mobile */}
          <div className="hidden md:block relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search anything..."
              className="pl-10 pr-12 w-56 lg:w-80 bg-secondary/50 border-transparent hover:bg-secondary/80 focus:bg-background focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all rounded-full h-10 shadow-inner"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 h-5 select-none items-center gap-1 rounded-full border border-border/50 bg-background/50 px-2 font-mono text-[10px] font-medium text-muted-foreground hidden lg:flex shadow-sm">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications Popover */}
            <Popover open={notifOpen} onOpenChange={setNotifOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-secondary/80 hover:text-primary rounded-full h-10 w-10 transition-colors group"
                  id="notifications-trigger"
                >
                  <Bell className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 border-2 border-background rounded-full text-[9px] font-black text-white flex items-center justify-center px-1 leading-none shadow-sm">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={8}
                className="w-[360px] p-0 rounded-3xl border-border/40 shadow-2xl backdrop-blur-2xl bg-background/95 overflow-hidden"
              >
                <NotificationsPanel />
              </PopoverContent>
            </Popover>

            <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block" />

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 p-1 pr-3 rounded-full hover:bg-secondary/80 border border-transparent hover:border-border/50 transition-all duration-300 flex items-center gap-2.5 group"
                  id="profile-trigger"
                >
                  <Avatar className="h-8 w-8 rounded-full ring-2 ring-background shadow-sm">
                    <AvatarImage src="/placeholder.svg" alt="Admin" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      AA
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:flex flex-col items-start leading-none gap-0.5">
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      Anichur Anis
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      Super Admin
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 p-2 rounded-2xl border-border/40 shadow-2xl backdrop-blur-xl bg-background/95"
              >
                <DropdownMenuLabel className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold text-foreground">
                      Anichur Anis
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      admin@shikhonary.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <div className="p-1 space-y-1">
                  <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer">
                    Notification Prefs
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-border/40" />
                <div className="p-1">
                  <DropdownMenuItem className="rounded-xl px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
