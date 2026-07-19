"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  Menu,
  GraduationCap,
  BookOpen,
  FileText,
  HelpCircle,
  ListTree,
  Layers,
  CreditCard,
  Sparkles,
  PlusCircle,
  CalendarDays,
  Bookmark,
  Scan,
} from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";

import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Users", url: "/users", icon: Users },
  { title: "Students", url: "/students", icon: Users },
  { title: "MCQs", url: "/mcqs", icon: HelpCircle },
  { title: "Exams", url: "/exams", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface SidebarContentProps {
  collapsed: boolean;
  onToggle?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
  collapsed,
  onToggle,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const user = { email: "user@example.com" }; // Placeholder

  const handleLogout = async () => {
    router.push("/auth");
  };

  // Collect all sidebar URLs to determine the best match for highlighting
  const allSidebarUrls = navItems.map((i) => i.url);

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/" || pathname === "/admin";
    }

    // Exact match is always active
    if (pathname === url) return true;

    // Check if current path is a sub-path of this item
    const isSubPath = pathname.startsWith(`${url}/`);
    if (!isSubPath) return false;

    // To avoid "Organizations" highlighting when "Add Tenant" (/tenants/new) is selected,
    // we only mark the parent as active if no other sidebar item provides a more specific match.
    const hasMoreSpecificMatch = allSidebarUrls.some(
      (otherUrl) =>
        otherUrl !== url &&
        pathname.startsWith(otherUrl) &&
        otherUrl.length > url.length,
    );

    return !hasMoreSpecificMatch;
  };

  const renderNavItem = (item: NavItem) => (
    <Link
      key={item.title}
      href={item.url}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
        isActive(item.url)
          ? "bg-primary text-primary-foreground shadow-glow"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      )}
    >
      <item.icon
        className={cn(
          "w-4 h-4 flex-shrink-0 transition-transform duration-200",
          isActive(item.url) ? "scale-110" : "group-hover:scale-110",
        )}
      />
      {!collapsed && <span>{item.title}</span>}
      {isActive(item.url) && !collapsed && (
        <div className="absolute right-2 w-1 h-4 rounded-full bg-primary-foreground/30 animate-pulse" />
      )}
    </Link>
  );

  return (
    <div className="flex flex-col h-full bg-card/60 backdrop-blur-md border-r border-border/50">
      {/* ── Sticky Sidebar Header (Logo + Collapse Button) ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-border/40 bg-card/60 backdrop-blur-md">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow transition-transform group-hover:scale-105">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold text-foreground leading-none">
                Shikhonary
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Admin Portal
              </span>
            </div>
          )}
        </Link>
        {onToggle && !collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="hidden lg:flex hover:bg-muted/50 text-muted-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* ── Scrollable Navigation ── */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-muted-foreground/20">
        <div className="space-y-1">{navItems.map(renderNavItem)}</div>
      </nav>

      {/* ── Sticky Sidebar Footer (User + Logout) ── */}
      <div className="flex-shrink-0 p-4 border-t border-border/50 bg-card/60 backdrop-blur-md">
        {!collapsed && user && (
          <div className="mb-4 px-3 py-3 rounded-xl bg-muted/30 border border-border/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                AA
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  Anichur Anis
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
            collapsed && "justify-center",
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed,
  onToggle,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <SidebarContent collapsed={collapsed} onToggle={onToggle} />
      {collapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-card border border-border shadow-sm z-10"
        >
          <ChevronLeft className="w-3 h-3 rotate-180" />
        </Button>
      )}
    </aside>
  );
};
