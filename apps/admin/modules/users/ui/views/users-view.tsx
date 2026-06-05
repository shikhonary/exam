"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

import { useState } from "react";
import { useDeleteUser, useToggleUserStatus } from "@workspace/api-client";
import { useDeleteModal } from "@workspace/ui/hooks/use-delete";

import { Pagination } from "../components/pagination";
import { Filter } from "../components/filter";
import { UserListStat } from "../components/user-list-stat";
import { UserList } from "../components/user-list";
import { useUsers } from "@workspace/api-client";
import { ChangeRoleModal } from "../modal/change-role-modal";

export const UsersView = () => {
  const { openDeleteModal } = useDeleteModal();

  const { data: usersData, isLoading: isQueryLoading } = useUsers();
  const { mutateAsync: toggleStatus, isPending: isToggling } = useToggleUserStatus();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const [roleModal, setRoleModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    userName: string | null;
    currentRole: string | null;
  }>({
    isOpen: false,
    userId: null,
    userName: null,
    currentRole: null,
  });

  const onToggleStatus = async (id: string) => {
    await toggleStatus({ id }).catch((error) => console.error(error));
  };

  const isLoading = isQueryLoading || isToggling || isDeleting;

  const handleDeleteUser = (userId: string, userName: string) => {
    openDeleteModal({
      entityId: userId,
      entityType: "user",
      entityName: userName,
      onConfirm: (id) => {
        deleteUser({ id });
      },
    });
  };

  const handleOpenRoleModal = (id: string, currentRole: string, name: string) => {
    setRoleModal({
      isOpen: true,
      userId: id,
      userName: name,
      currentRole,
    });
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

      <main className="container mx-auto px-6 py-12 lg:px-12 max-w-7xl relative z-10">
        {/* Header */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-8 -left-6 w-72 h-24 rounded-full opacity-20 blur-3xl bg-primary"
          />

          <div className="relative max-w-2xl animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl leading-[1.15] font-extrabold tracking-[-0.03em] text-on-surface font-headline">
              User Management
            </h1>

            <div className="mt-2 mb-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-primary to-primary-container" />

            <p className="text-sm leading-6 text-on-surface-variant max-w-lg font-medium italic opacity-70">
              Manage platform users, assign roles, and control access permissions.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 animate-in fade-in zoom-in-95 duration-500">
          <UserListStat />
        </div>

        {/* Main Content Area */}
        <div className="mt-12 bg-surface-container-lowest rounded-2xl shadow-ambient overflow-hidden flex flex-col border border-outline/5 relative isolate animate-in slide-in-from-bottom-8 duration-700 delay-200">
          <Filter isLoading={isLoading} />

          <UserList
            onToggleStatus={onToggleStatus}
            isLoading={isLoading}
            handleDelete={handleDeleteUser}
            onChangeRole={handleOpenRoleModal}
          />

          <Pagination totalItem={usersData?.total ?? 0} />
        </div>
      </main>

      <ChangeRoleModal
        isOpen={roleModal.isOpen}
        onClose={() => setRoleModal({ ...roleModal, isOpen: false })}
        userId={roleModal.userId}
        userName={roleModal.userName}
        currentRole={roleModal.currentRole}
      />
    </div>
  );
};
