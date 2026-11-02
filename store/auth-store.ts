"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/data/types";

interface SessionUser {
  name: string;
  email: string;
  phone: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthState {
  user: SessionUser | null;
  users: User[];
  login: (email: string, password: string) => AuthResult;
  register: (name: string, email: string, password: string) => AuthResult;
  logout: () => void;
  updateProfile: (patch: Partial<SessionUser>) => void;
  changePassword: (current: string, next: string) => AuthResult;
}

const seedUsers: User[] = [
  {
    name: "Chandan Kumar",
    email: "chandan@eshop.in",
    phone: "+91 98765 43210",
    password: "chandan123",
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: seedUsers,

      login: (email, password) => {
        const found = get().users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (!found) return { ok: false, error: "No account found with this email." };
        if (found.password !== password) {
          return { ok: false, error: "Incorrect password. Please try again." };
        }
        set({
          user: { name: found.name, email: found.email, phone: found.phone ?? "" },
        });
        return { ok: true };
      },

      register: (name, email, password) => {
        const exists = get().users.some(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (exists) {
          return { ok: false, error: "An account with this email already exists." };
        }
        const newUser: User = { name: name.trim(), email: email.trim(), password };
        set((s) => ({ users: [...s.users, newUser] }));
        return { ok: true };
      },

      logout: () => set({ user: null }),

      updateProfile: (patch) => {
        const current = get().user;
        if (!current) return;
        const next: SessionUser = { ...current, ...patch };
        set((s) => ({
          user: next,
          users: s.users.map((u) =>
            u.email.toLowerCase() === current.email.toLowerCase()
              ? { ...u, name: next.name, email: next.email, phone: next.phone }
              : u
          ),
        }));
      },

      changePassword: (currentPw, nextPw) => {
        const current = get().user;
        if (!current) return { ok: false, error: "You are not signed in." };
        const account = get().users.find(
          (u) => u.email.toLowerCase() === current.email.toLowerCase()
        );
        if (!account || account.password !== currentPw) {
          return { ok: false, error: "Current password is incorrect." };
        }
        set((s) => ({
          users: s.users.map((u) =>
            u.email.toLowerCase() === current.email.toLowerCase()
              ? { ...u, password: nextPw }
              : u
          ),
        }));
        return { ok: true };
      },
    }),
    { name: "eshop-auth" }
  )
);
