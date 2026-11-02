"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@/data/types";

interface AddressState {
  addresses: Address[];
  add: (a: Omit<Address, "id">) => Address;
  update: (id: string, patch: Partial<Address>) => void;
  remove: (id: string) => void;
}

const defaultAddresses: Address[] = [
  {
    id: "addr-default",
    fullName: "Chandan Kumar",
    phone: "+91 98765 43210",
    email: "chandan@eshop.in",
    line: "A-42, Sector 18, Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
  },
];

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: defaultAddresses,
      add: (a) => {
        const entry: Address = {
          ...a,
          id: "addr-" + Math.random().toString(36).slice(2, 9),
        };
        set((s) => ({ addresses: [...s.addresses, entry] }));
        return entry;
      },
      update: (id, patch) =>
        set((s) => ({
          addresses: s.addresses.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      remove: (id) =>
        set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
    }),
    { name: "eshop-addresses" }
  )
);
