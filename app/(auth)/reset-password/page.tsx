"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = form.get("password");
    const confirmPassword = form.get("confirm-password");

    if (!password || password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col w-full items-center justify-center p-gutter min-w-0">
      <div className="relative w-full max-w-lg py-space-md sm:py-space-xl flex justify-center">
        <div className="absolute -top-10 -left-12 w-72 h-72 rounded-full bg-primary-fixed blur-3xl opacity-60 pointer-events-none -z-10" />
        <div className="absolute -bottom-10 -right-12 w-80 h-80 rounded-full bg-secondary-container blur-3xl opacity-40 pointer-events-none -z-10" />

        <div className="w-full bg-surface-container-lowest rounded-3xl shadow-xl overflow-hidden p-space-lg sm:p-space-xl">
          <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-sm mb-space-lg">
            <Image
              src="/auth-forgot-password.jpg"
              alt="Claymorphic padlock mascot illustration"
              fill
              className="object-cover"
            />
          </div>

          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
            Set a new password
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1 mb-space-lg">
            Choose a strong new password to get your squad session back online.
          </p>

          <form className="space-y-space-md" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block font-display text-label-md text-on-surface font-semibold mb-1.5"
              >
                New password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  required
                  placeholder="••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-low rounded-xl text-on-surface font-body text-body-md placeholder:text-outline/70 focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px] focus:shadow-primary transition-all duration-200"
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

            <div>
              <label
                htmlFor="confirm-password"
                className="block font-display text-label-md text-on-surface font-semibold mb-1.5"
              >
                Confirm new password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                  lock
                </span>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={confirmVisible ? "text" : "password"}
                  required
                  placeholder="••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-surface-container-low rounded-xl text-on-surface font-body text-body-md placeholder:text-outline/70 focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px] focus:shadow-primary transition-all duration-200"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setConfirmVisible((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {confirmVisible ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-space-md py-3.5 px-6 rounded-xl bg-primary hover:bg-surface-tint active:scale-[0.98] text-on-primary font-display text-label-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200"
            >
              <span>Reset password</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>

            {error && (
              <div className="text-error font-display text-label-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </div>
            )}
            {submitted && (
              <div className="text-secondary font-display text-label-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Password reset! You can now log in with your new password.
              </div>
            )}
          </form>

          <div className="text-center mt-space-lg pt-space-xs">
            <p className="font-body text-body-sm text-on-surface-variant">
              Back to{" "}
              <Link href="/sign-in" className="font-display text-label-md text-primary font-bold hover:underline">
                log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
