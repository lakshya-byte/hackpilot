"use client";

import { useEffect, useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

type Channel = "magic_link" | "otp";

export default function ForgotPasswordPage() {
  const [channel, setChannel] = useState<Channel>("magic_link");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toastVisible) return;
    const hide = setTimeout(() => setToastVisible(false), 4000);
    return () => clearTimeout(hide);
  }, [toastVisible]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setToastVisible(true);
      setTimeout(() => setStatus("idle"), 4000);
    }, 900);
  }

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden bg-gradient-to-br from-surface-bright via-surface-container-low to-primary-fixed/20">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-primary-fixed-dim/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-secondary-container/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 -right-12 w-48 h-48 rounded-full bg-surface-container-highest/60 blur-2xl pointer-events-none" />

        <div className="relative w-full max-w-[960px] bg-surface-container-lowest rounded-[28px] shadow-[0_20px_50px_-10px_rgba(79,70,229,0.08),0_10px_20px_-5px_rgba(19,27,46,0.03)] overflow-hidden">
          <div className="w-full bg-surface-container-low/70 px-6 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex relative w-2.5 h-2.5 rounded-full bg-secondary">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed-dim opacity-75" />
              </span>
              <span className="font-display text-label-caps text-on-surface-variant uppercase tracking-wider">
                Fast-Pass Auth Recovery v2.4
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">timer</span>
              <span className="font-display text-label-md text-primary">Avg. Recovery: &lt; 45s</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            {/* Left: Visual */}
            <div className="lg:col-span-5 bg-gradient-to-b from-primary-fixed/30 via-surface-container to-surface-container-low p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-secondary-container/30 blur-md pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 shadow-sm backdrop-blur-md mb-4">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  <span className="font-display text-label-caps text-on-surface tracking-wider">
                    Zero Teammate Downtime
                  </span>
                </div>
                <h2 className="font-display text-headline-md text-on-surface tracking-tight leading-snug">
                  Sync back in minutes.
                </h2>
                <p className="font-body text-body-sm text-on-surface-variant mt-1">
                  Your git branches, team kanbans, and live deployment endpoints stay safely reserved.
                </p>
              </div>

              <div className="relative z-10 my-6 flex items-center justify-center">
                <div className="relative w-full max-w-[260px] aspect-square rounded-[24px] overflow-hidden shadow-[0_16px_36px_rgba(79,70,229,0.12)] group">
                  <Image
                    src="/auth-forgot-password.jpg"
                    alt="Claymorphic padlock mascot illustration"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                    <span
                      className="material-symbols-outlined text-secondary text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      shield_with_heart
                    </span>
                    <span className="font-display text-label-md text-on-surface">
                      Hackathon safe-state active
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 bg-surface-container-lowest/80 backdrop-blur-sm rounded-xl p-3.5 shadow-sm">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-primary-container text-[20px] mt-0.5">
                    lightbulb
                  </span>
                  <p className="font-body text-body-sm text-on-surface-variant">
                    Need to push urgent code? Team captains can temporarily authorize a buddy commit token from
                    Settings.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-surface-container-lowest">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">
                      arrow_back
                    </span>
                    <span className="font-display text-label-md">Back to Log In</span>
                  </Link>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-display text-label-caps">
                    Step 1 of 2
                  </span>
                </div>

                <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
                  Locked out under sprint pressure?
                </h1>
                <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-lg leading-relaxed">
                  Don&apos;t worry, even grand finalists lose access during 4 AM commits. Enter your registered
                  email to restore instant access.
                </p>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="recovery-email"
                      className="block font-display text-label-lg text-on-surface flex items-center justify-between"
                    >
                      <span>Squad or College Email</span>
                      <span className="font-display text-label-caps text-on-surface-variant text-[11px] font-normal">
                        Registered campus address
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                        <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                      </div>
                      <input
                        id="recovery-email"
                        name="email"
                        type="email"
                        required
                        placeholder="aditya.dev@iitb.ac.in"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-surface-container-low rounded-xl font-body text-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <span className="block font-display text-label-lg text-on-surface">
                      Select Fast-Pass Delivery Channel
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup">
                      <label
                        className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          channel === "magic_link"
                            ? "bg-primary-fixed/20 shadow-sm"
                            : "bg-surface-container-low hover:bg-surface-container"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">magic_button</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">
                            RECOMMENDED
                          </span>
                        </div>
                        <div className="mt-3 flex items-start gap-2">
                          <input
                            type="radio"
                            name="recovery_channel"
                            value="magic_link"
                            checked={channel === "magic_link"}
                            onChange={() => setChannel("magic_link")}
                            className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
                          />
                          <div>
                            <div className="font-display text-label-lg text-on-surface">Magic Login Link</div>
                            <div className="font-body text-body-sm text-on-surface-variant mt-0.5">
                              Instant one-click unlock sent directly to inbox
                            </div>
                          </div>
                        </div>
                      </label>

                      <label
                        className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          channel === "otp"
                            ? "bg-primary-fixed/20 shadow-sm"
                            : "bg-surface-container-low hover:bg-surface-container"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-lg bg-surface-variant text-on-surface flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">password</span>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-container-highest text-on-surface-variant">
                            6 DIGITS
                          </span>
                        </div>
                        <div className="mt-3 flex items-start gap-2">
                          <input
                            type="radio"
                            name="recovery_channel"
                            value="otp"
                            checked={channel === "otp"}
                            onChange={() => setChannel("otp")}
                            className="mt-1 w-4 h-4 text-primary accent-primary cursor-pointer"
                          />
                          <div>
                            <div className="font-display text-label-lg text-on-surface">SMS / Auth OTP</div>
                            <div className="font-body text-body-sm text-on-surface-variant mt-0.5">
                              Receive 6-digit backup code to phone/authenticator
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className={`w-full py-3.5 px-6 rounded-xl text-on-secondary font-display text-label-lg flex items-center justify-center gap-2 shadow-[0_8px_20px_-4px_rgba(0,108,73,0.3)] hover:shadow-[0_12px_24px_-4px_rgba(0,108,73,0.4)] active:scale-[0.99] transition-all duration-200 disabled:opacity-80 ${
                        status === "sent"
                          ? "bg-primary hover:bg-primary-container text-on-primary"
                          : "bg-secondary hover:bg-tertiary-container"
                      }`}
                    >
                      {status === "sending" && (
                        <>
                          <span>Generating Secure Key...</span>
                          <span className="material-symbols-outlined text-[20px] animate-spin">
                            progress_activity
                          </span>
                        </>
                      )}
                      {status === "sent" && <span>Key Dispatched! ✨</span>}
                      {status === "idle" && <span>Send Recovery Key 🔑</span>}
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left bg-surface-container-low/60 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">lock_reset</span>
                  <span className="font-body text-body-sm text-on-surface-variant">
                    256-bit TLS encrypted session recovery
                  </span>
                </div>
                <a
                  href="#"
                  className="font-display text-label-md text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Talk to Mentor On-Call</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-300 pointer-events-none ${
            toastVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
          }`}
        >
          <div className="bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <span
              className="material-symbols-outlined text-secondary-fixed text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span className="font-display text-label-lg">
              Recovery instructions dispatched! Check your college inbox.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
