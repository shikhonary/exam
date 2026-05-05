"use client";

import { create } from "zustand";
import { TenantTypes } from "@workspace/db";

interface CreateWardModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateWardModal = create<CreateWardModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface EditWardModalState {
  isOpen: boolean;
  ward: TenantTypes.Ward | null;
  onOpen: (ward: TenantTypes.Ward) => void;
  onClose: () => void;
}

export const useEditWardModal = create<EditWardModalState>((set) => ({
  isOpen: false,
  ward: null,
  onOpen: (ward) => set({ isOpen: true, ward }),
  onClose: () => set({ isOpen: false, ward: null }),
}));
