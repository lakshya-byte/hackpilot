"use client";

import { useMemo, useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

type Strength = "empty" | "weak" | "good" | "strong";

const strengthMeta: Record<Strength, { label: string; labelClass: string; dotOn: string; dotsLit: number }> = {
  empty: {
    label: "Strength: Fair",
    labelClass: "font-display text-label-caps text-outline uppercase",
    dotOn: "bg-secondary-container",
    dotsLit: 2,
  },
  weak: {
    label: "Strength: Weak",
    labelClass: "font-display text-label-caps text-error uppercase font-bold",
    dotOn: "bg-error-container",
    dotsLit: 1,
  },
  good: {
    label: "Strength: Good",
    labelClass: "font-display text-label-caps text-primary uppercase font-bold",
    dotOn: "bg-primary-fixed-dim",
    dotsLit: 3,
  },
  strong: {
    label: "Strength: Hacker Proof 🔥",
    labelClass: "font-display text-label-caps text-secondary uppercase font-bold",
    dotOn: "bg-secondary-container",
    dotsLit: 4,
  },
};

function strengthFor(password: string): Strength {
  if (password.length === 0) return "empty";
  if (password.length < 6) return "weak";
  if (password.length < 10) return "good";
  return "strong";
}

export default function SignUpPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const strength = useMemo(() => strengthFor(password), [password]);
  const meta = strengthMeta[strength];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!form.get("agree-terms")) {
      setError("You must agree to the Fair Play Pledge to continue.");
      return;
    }
    setError("");
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSucceeded(true);
    }, 1000);
  }

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 md:p-10 lg:p-12 overflow-hidden bg-gradient-to-tr from-surface-container-high via-surface to-surface-variant">
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-primary-fixed blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-secondary-container blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-52 h-52 rounded-full bg-surface-container-highest blur-2xl opacity-60 pointer-events-none" />

        <div className="relative z-10 w-full max-w-5xl bg-surface-container-lowest rounded-[2.25rem] shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
            {/* Left: Sign-Up Form */}
            <div className="lg:col-span-6 p-7 sm:p-10 md:p-12 flex flex-col justify-between bg-surface-container-lowest z-10">
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-on-primary text-[20px]">
                        rocket_launch
                      </span>
                    </div>
                    <span className="font-display text-headline-sm text-on-surface tracking-tight font-extrabold">
                      HackPilot
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-full">
                    <span className="font-body text-body-sm text-on-surface-variant">Member?</span>
                    <Link href="/sign-in" className="font-display text-label-md text-primary hover:underline font-bold">
                      Sign in
                    </Link>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h1 className="font-display text-headline-lg text-on-surface tracking-tight font-extrabold">
                    Join the Squad{" "}
                    <span className="inline-block transform hover:rotate-12 transition-transform cursor-pointer">
                      👾
                    </span>
                  </h1>
                  <p className="font-body text-body-md text-on-surface-variant">
                    Assemble dream teams, ideate with AI, and crush submissions.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    type="button"
                    className="group relative flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    <span className="font-display text-label-md text-on-surface font-semibold">Google</span>
                  </button>
                  <button
                    type="button"
                    className="group flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 flex-shrink-0 fill-current text-on-surface" viewBox="0 0 24 24">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                    <span className="font-display text-label-md text-on-surface font-semibold">GitHub</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 my-5">
                  <div className="h-px bg-surface-container flex-1" />
                  <span className="font-display text-label-caps text-outline uppercase tracking-wider">
                    or sign up with email
                  </span>
                  <div className="h-px bg-surface-container flex-1" />
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block font-display text-label-md text-on-surface-variant mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                        badge
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Alex Mercer"
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl font-body text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#4f46e5] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-display text-label-md text-on-surface-variant mb-1.5">
                      College or Builder Email
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                        alternate_email
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="alex@stanford.edu"
                        className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-xl font-body text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#4f46e5] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-display text-label-md text-on-surface-variant">
                        Choose Password
                      </label>
                      <span className={meta.labelClass}>{meta.label}</span>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                        lock
                      </span>
                      <input
                        type={passwordVisible ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-surface-container-low rounded-xl font-body text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#4f46e5] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors flex items-center"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {passwordVisible ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all ${
                            i < meta.dotsLit ? meta.dotOn : "bg-surface-container-highest"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      id="fairplay-cb"
                      name="agree-terms"
                      type="checkbox"
                      className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer"
                    />
                    <label
                      htmlFor="fairplay-cb"
                      className="font-body text-body-sm text-on-surface-variant cursor-pointer select-none"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-primary font-display text-label-md hover:underline">
                        Fair Play Pledge
                      </a>{" "}
                      &amp; Platform Guidelines.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full mt-2 py-3 px-6 rounded-xl text-on-primary transition-all font-display text-label-lg flex items-center justify-center gap-2 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-80 ${
                      succeeded ? "bg-secondary" : "bg-primary-container hover:bg-primary"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                        <span>Assembling Squad Badge...</span>
                      </>
                    ) : succeeded ? (
                      <>
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span>Welcome Aboard! 🎉</span>
                      </>
                    ) : (
                      <>
                        <span>Create My Account</span>
                        <span className="text-secondary-container font-extrabold text-base">✨</span>
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="text-error font-display text-label-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      {error}
                    </div>
                  )}
                </form>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between text-on-surface-variant">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified_user</span>
                  <span className="font-body text-body-sm">Official Major League Hackathon Partner</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed-dim animate-pulse" />
                  <span className="font-display text-label-caps text-secondary font-bold">LIVE STAGE</span>
                </div>
              </div>
            </div>

            {/* Right: Claymorphic Tech Stage */}
            <div className="lg:col-span-6 relative bg-gradient-to-br from-surface-container-high via-surface-variant to-primary-fixed p-8 lg:p-10 flex flex-col justify-between overflow-hidden">
              <div className="relative z-20 flex items-center justify-between w-full">
                <div className="inline-flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                  <span className="font-display text-label-caps text-on-surface font-bold uppercase tracking-wider">
                    Spring Hack Season 2025
                  </span>
                </div>
                <div className="bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[15px]">trophy</span>
                  <span className="font-display text-label-md text-on-surface font-bold">$120,000 Pool</span>
                </div>
              </div>

              <div className="relative z-10 my-auto py-6 flex items-center justify-center">
                <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                  <div className="absolute -top-4 -right-4 w-44 h-44 rounded-3xl bg-secondary-container/60 transform rotate-12 blur-sm" />
                  <div className="absolute -bottom-6 -left-4 w-48 h-48 rounded-full bg-primary-fixed-dim/70 transform -rotate-6 blur-md" />

                  <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl bg-surface-container-lowest/40 backdrop-blur-sm p-3">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <Image
                        src="/auth-signup.jpg"
                        alt="Claymorphic robot mascot celebrating a hackathon win"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 bg-surface-container-lowest/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border-t border-surface-bright transition-transform hover:-translate-y-1">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex-shrink-0 flex items-center justify-center text-on-tertiary-fixed shadow-sm">
                          <span className="material-symbols-outlined text-[20px]">psychology</span>
                        </div>
                        <div>
                          <p className="font-display text-headline-sm text-on-surface font-extrabold leading-snug">
                            &ldquo;Zero to podium blueprint in 36 hours.&rdquo;
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex -space-x-1.5">
                              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-on-primary font-bold">
                                M
                              </span>
                              <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] text-on-secondary font-bold">
                                K
                              </span>
                              <span className="w-5 h-5 rounded-full bg-tertiary flex items-center justify-center text-[10px] text-on-tertiary font-bold">
                                S
                              </span>
                            </div>
                            <span className="font-body text-body-sm text-on-surface-variant font-medium">
                              CalHacks 1st Place Team
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-3 -left-3 bg-surface-container-lowest px-3 py-1.5 rounded-2xl shadow-md flex items-center gap-1.5 animate-bounce" style={{ animationDuration: "4s" }}>
                    <span className="text-base">⚡️</span>
                    <span className="font-display text-label-md text-on-surface font-extrabold">
                      Instant Teammate Match
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-surface-container-lowest px-3 py-1.5 rounded-2xl shadow-md flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[16px]">bolt</span>
                    <span className="font-display text-label-md text-on-surface font-extrabold">Auto Pitch Decks</span>
                  </div>
                </div>
              </div>

              <div className="relative z-20 grid grid-cols-3 gap-2 bg-surface-container-lowest/60 backdrop-blur-md p-3 rounded-2xl text-center shadow-sm">
                <div>
                  <div className="font-display text-headline-sm text-on-surface font-extrabold">4,280+</div>
                  <div className="font-display text-label-caps text-on-surface-variant uppercase font-bold tracking-tight">
                    Active Builders
                  </div>
                </div>
                <div className="border-x border-outline-variant/30">
                  <div className="font-display text-headline-sm text-primary font-extrabold">128</div>
                  <div className="font-display text-label-caps text-on-surface-variant uppercase font-bold tracking-tight">
                    Active Sprints
                  </div>
                </div>
                <div>
                  <div className="font-display text-headline-sm text-secondary font-extrabold">98.4%</div>
                  <div className="font-display text-label-caps text-on-surface-variant uppercase font-bold tracking-tight">
                    Project Ship Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
