"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

import {
  useTenants,
  useActivateTenant,
  useDeactivateTenant,
  useDeleteTenant,
} from "@workspace/api-client";

import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import { Pagination } from "../components/pagination";
import { Filter } from "../components/filter";
import { TenantListStat } from "../components/tenant-list-stat";
import { TenantList } from "../components/tenant-list";
import { InviteTenantAdminDialog } from "../modal/tenant-invitation-modal";
import { useInvitationModal } from "@workspace/ui/hooks/use-invitation-modal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const TenantsView = () => {
  const { openDeleteModal } = useDeleteModal();
  const { onOpen: openInvitationModal } = useInvitationModal();

  const { data: tenantsData } = useTenants();
  const { mutateAsync: activateTenant, isPending: isActivating } =
    useActivateTenant();
  const { mutateAsync: deactivateTenant, isPending: isDeactivating } =
    useDeactivateTenant();
  const { mutate: deleteTenant, isPending: isDeleting } = useDeleteTenant();


  const onActivate = async (id: string) => {
    await activateTenant({ id })
      .catch((error) => console.error(error));
  };

  const onDeactivate = async (id: string) => {
    await deactivateTenant({ id })
      .catch((error) => console.error(error));
  };

  const isLoading =
    isActivating ||
    isDeactivating ||
    isDeleting;

  const handleDeleteTenant = (tenantId: string, tenantName: string) => {
    openDeleteModal({
      entityId: tenantId,
      entityType: "tenant",
      entityName: tenantName,
      onConfirm: (id) => {
        deleteTenant({ id });
      },
    });
  };

  const handleInviteAdmin = (tenantId: string, tenantName: string) => {
    openInvitationModal(tenantId, tenantName);
  };

  return (
    <div className="min-h-screen bg-surface relative isolate">
      {/* Background blobs for depth */}
      <div
        aria-hidden
        className="absolute top-[20%] -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-[10%] -right-16 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 pointer-events-none"
      />

      <InviteTenantAdminDialog />

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
          />

          <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              Tenants Management
            </h1>

            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />

            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              Manage your tenants, their subscriptions, and administrative access across the platform.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">


            <Button
              asChild
              className="
                group relative overflow-hidden
                inline-flex items-center gap-2
                bg-gradient-to-br from-primary to-primary-container
                text-white font-black text-sm
                px-6 py-3 rounded-[16px]
                border-0
                shadow-lg shadow-primary/25
                hover:shadow-xl hover:shadow-primary/30
                hover:scale-[1.03]
                active:scale-[0.97]
                transition-all duration-200 ease-out
                h-12
              "
            >
              <Link href="/tenants/new">
                <span className="relative flex items-center justify-center rounded-lg bg-white/20 p-0.5">
                  <Plus size={16} strokeWidth={3} />
                </span>
                <span className="relative">Add Tenant</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 animate-in fade-in zoom-in-95 duration-500">
          <TenantListStat />
        </div>

        {/* Main Content Area */}
        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate animate-in slide-in-from-bottom-8 duration-700 delay-200">
          <Filter isLoading={isLoading} />


          <TenantList
            onActive={onActivate}
            onDeactivate={onDeactivate}
            isLoading={isLoading}
            handleDelete={handleDeleteTenant}
            onInviteAdmin={handleInviteAdmin}
          />

          <Pagination totalItem={tenantsData?.total ?? 0} />
        </div>
      </main>
    </div>
  );
};
