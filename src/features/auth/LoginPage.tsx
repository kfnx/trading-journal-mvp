import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiCandleLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      if (ok) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Try trader / journal2026");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 dark:bg-neutral-950">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary-600 shadow-md">
              <RiCandleLine className="size-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Trading Journal
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                Sign in to your account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="trader"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                hasError={!!error}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  hasError={!!error}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <RiEyeOffLine className="size-4" />
                  ) : (
                    <RiEyeLine className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-error-50 px-3 py-2 text-xs text-error-600 dark:bg-error-950 dark:text-error-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="mt-1 w-full"
              disabled={loading || !username || !password}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-neutral-400">
            Demo credentials: <span className="font-medium">trader</span> /{" "}
            <span className="font-medium">journal2026</span>
          </p>
        </div>
      </div>
    </div>
  );
}
