import { create } from "zustand";
import { persist } from "zustand/middleware";

const CREDENTIALS = { username: "trader", password: "journal2026" };

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      login: (username, password) => {
        if (
          username === CREDENTIALS.username &&
          password === CREDENTIALS.password
        ) {
          set({ isAuthenticated: true, username });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, username: null }),
    }),
    { name: "tj-auth" },
  ),
);
