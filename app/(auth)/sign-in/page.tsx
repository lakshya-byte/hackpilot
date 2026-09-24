"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    setSubmitted(false);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      router.push("/profile");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col w-full items-center justify-center p-gutter min-w-0">
      <div className="relative w-full max-w-5xl py-space-md sm:py-space-xl flex justify-center">
        <div className="absolute -top-10 -left-12 w-72 h-72 rounded-full bg-primary-fixed blur-3xl opacity-60 pointer-events-none -z-10" />
        <div className="absolute -bottom-10 -right-12 w-80 h-80 rounded-full bg-secondary-container blur-3xl opacity-40 pointer-events-none -z-10" />

        <div className="w-full bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-w-0">
          {/* Left Panel: Claymorphic Visual */}
          <div className="lg:col-span-6 bg-surface-container-low p-space-md sm:p-space-lg flex flex-col justify-between relative overflow-hidden order-2 lg:order-1">
            <div className="flex items-center justify-between z-10 w-full mb-space-md">
              <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="font-display text-label-caps text-on-surface uppercase tracking-wider">
                  Spring Hack 2025 Live
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-fixed text-primary font-display text-label-md shadow-sm">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Squad sync ready</span>
              </div>
            </div>

            <div className="relative w-full aspect-square max-h-[460px] mx-auto flex items-center justify-center rounded-2xl overflow-hidden my-auto shadow-sm">
              <Image
                src="/auth-signin.jpg"
                alt="Claymorphic flower mascot sign-in illustration"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl p-space-sm shadow-md flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shrink-0">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    groups
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-label-md text-on-surface font-bold truncate">
                      Nova Team #04
                    </span>
                    <span className="font-display text-label-caps text-secondary font-bold">
                      98% BUILD READINESS
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-1.5 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full w-[92%] transition-all duration-1000" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-space-md pt-space-xs flex items-center justify-between z-10 text-on-surface-variant font-body text-body-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  verified_user
                </span>
                <span>Zero-config Devpost &amp; GitHub Sync</span>
              </div>
              <span className="font-display text-label-caps text-outline">v2.4.1 CLOUD</span>
            </div>
          </div>

          {/* Right Panel: Sign-In Form */}
          <div className="lg:col-span-6 p-space-lg sm:p-space-xl flex flex-col justify-center order-1 lg:order-2 bg-surface-container-lowest">
            <div className="w-full max-w-md mx-auto">
              <div className="flex items-center justify-between mb-space-md">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="HackPilot logo"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="font-display text-label-lg text-primary font-bold">
                    HackPilot
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-on-surface-variant font-body text-body-sm">
                    New squad?{" "}
                  </span>
                  <Link
                    href="/sign-up"
                    className="font-display text-label-md text-primary font-bold hover:underline"
                  >
                    Register
                  </Link>
                </div>
              </div>

              <div className="mb-space-lg">
                <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
                  Welcome Back!
                </h1>
                <p className="font-body text-body-md text-on-surface-variant mt-1">
                  Enter your squad credentials to access your live war-room.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-space-md">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all text-on-surface font-display text-label-md shadow-sm active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-all text-on-surface font-display text-label-md shadow-sm active:scale-[0.98]"
                >
                  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center my-space-md">
                <div className="w-full h-px bg-outline-variant/40" />
                <span className="absolute px-3 bg-surface-container-lowest text-outline font-display text-label-caps uppercase">
                  or continue with email
                </span>
              </div>

              <form className="space-y-space-md" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="college-email"
                    className="block font-display text-label-md text-on-surface font-semibold mb-1.5"
                  >
                    Squad or College Email
                  </label>
                  <div className="relative">
                    <input
                      id="college-email"
                      name="email"
                      type="email"
                      required
                      placeholder="alex@stanford.edu or squad@domain.com"
                      className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-on-surface font-body text-body-md placeholder:text-outline/70 focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px] focus:shadow-primary transition-all duration-200"
                    />
                    <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                      alternate_email
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="user-password"
                      className="block font-display text-label-md text-on-surface font-semibold"
                    >
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="font-display text-label-md text-primary font-semibold hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="user-password"
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      required
                      placeholder="••••••••••"
                      className="w-full px-4 py-3 bg-surface-container-low rounded-xl text-on-surface font-body text-body-md placeholder:text-outline/70 focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px] focus:shadow-primary transition-all duration-200 tracking-wide"
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setPasswordVisible((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface focus:outline-none"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {passwordVisible ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 rounded text-secondary accent-secondary focus:ring-0 cursor-pointer"
                    />
                    <span className="font-body text-body-sm text-on-surface-variant">
                      Stay signed in for 48h sprint
                    </span>
                  </label>
                  <span className="inline-flex items-center gap-1 font-display text-label-caps text-secondary font-bold">
                    <span className="material-symbols-outlined text-[14px]">shield</span> Encrypted
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-space-md py-3.5 px-6 rounded-xl bg-primary hover:bg-surface-tint active:scale-[0.98] disabled:opacity-70 text-on-primary font-display text-label-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>Log in to Workspace</span>
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="text-error font-display text-label-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    {error}
                  </div>
                )}

                {submitted && !error && (
                  <div className="text-secondary font-display text-label-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Logged in! Redirecting to your dashboard.
                  </div>
                )}
              </form>

              <div className="text-center mt-space-lg pt-space-xs">
                <p className="font-body text-body-sm text-on-surface-variant">
                  Looking for a hackathon team?{" "}
                  <a
                    href="#"
                    className="font-display text-label-md text-secondary font-bold hover:underline ml-1"
                  >
                    Browse open squads →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
