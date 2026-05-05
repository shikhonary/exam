"use client";

import { create } from "zustand";
import { TenantTypes } from "@workspace/db";

interface CreateVillageModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateVillageModal = create<CreateVillageModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface EditVillageModalState {
  isOpen: boolean;
  village: (TenantTypes.Village & { ward?: { name: string; displayName: string } }) | null;
  onOpen: (village: TenantTypes.Village & { ward?: { name: string; displayName: string } }) => void;
  onClose: () => void;
}

export const useEditVillageModal = create<EditVillageModalState>((set) => ({
  isOpen: false,
  village: null,
  onOpen: (village) => set({ isOpen: true, village }),
  onClose: () => set({ isOpen: false, village: null }),
}));
