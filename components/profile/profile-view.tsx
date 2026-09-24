"use client";

import { useState } from "react";
import type { Profile, UpdateProfileInput } from "@/lib/types";
import AvatarUploader from "./avatar-uploader";
import ChipInput from "./chip-input";
import StatsPreview from "./stats-preview";

type Draft = {
  username: string;
  bio: string;
  location: string;
  institution: string;
  degree: string;
  graduation_year: string;
  experience_label: string;
  resume_url: string;
  github: string;
  linkedin: string;
  twitter: string;
  portfolio: string;
  primary_specialization: string;
  domain_capabilities: string[];
  tech_stack: string[];
};

function toDraft(p: Profile): Draft {
  return {
    username: p.username ?? "",
    bio: p.bio ?? "",
    location: p.location ?? "",
    institution: p.institution ?? "",
    degree: p.degree ?? "",
    graduation_year: p.graduation_year ? String(p.graduation_year) : "",
    experience_label: p.experience_label ?? "",
    resume_url: p.resume_url ?? "",
    github: p.socials?.github ?? "",
    linkedin: p.socials?.linkedin ?? "",
    twitter: p.socials?.twitter ?? "",
    portfolio: p.socials?.portfolio ?? "",
    primary_specialization: p.primary_specialization ?? "",
    domain_capabilities: p.domain_capabilities ?? [],
    tech_stack: p.tech_stack ?? [],
  };
}

export default function ProfileView({ profile: initialProfile }: { profile: Profile }) {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => toDraft(initialProfile));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEdit() {
    setDraft(toDraft(profile));
    setError("");
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setError("");
  }

  async function save() {
    setSaving(true);
    setError("");

    // The backend DTO uses "field absent = don't touch it" pointer semantics,
    // and validates fields like URLs when present — so an empty string must
    // be omitted, not sent as "", or validation rejects it (e.g. resume_url
    // failing the `url` check on ""). Only non-empty fields are included.
    const payload: UpdateProfileInput = {
      domain_capabilities: draft.domain_capabilities,
      tech_stack: draft.tech_stack,
    };
    const strings: [keyof UpdateProfileInput, string][] = [
      ["username", draft.username],
      ["bio", draft.bio],
      ["location", draft.location],
      ["institution", draft.institution],
      ["degree", draft.degree],
      ["experience_label", draft.experience_label],
      ["resume_url", draft.resume_url],
      ["primary_specialization", draft.primary_specialization],
    ];
    for (const [key, value] of strings) {
      const trimmed = value.trim();
      if (trimmed) (payload as Record<string, unknown>)[key] = trimmed;
    }

    const socials = {
      github: draft.github.trim(),
      linkedin: draft.linkedin.trim(),
      twitter: draft.twitter.trim(),
      portfolio: draft.portfolio.trim(),
    };
    if (Object.values(socials).some(Boolean)) {
      payload.socials = Object.fromEntries(
        Object.entries(socials).filter(([, v]) => v)
      );
    }

    if (draft.graduation_year.trim()) {
      payload.graduation_year = Number(draft.graduation_year.trim());
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Couldn't save your changes.");
        setSaving(false);
        return;
      }

      setProfile(data);
      setEditing(false);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const input =
    "w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body text-body-sm placeholder:text-outline/70 focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-primary transition-all";
  const label = "block font-display text-label-md text-outline uppercase mb-space-xs";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/* Left column: identity */}
      <div className="lg:col-span-5 space-y-gutter">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-gutter">
          <div className="flex items-start justify-between">
            <AvatarUploader
              name={profile.name}
              avatarUrl={profile.avatar_url}
              onUploaded={(url) => setProfile((p) => ({ ...p, avatar_url: url }))}
            />
            <button
              type="button"
              onClick={editing ? cancelEdit : startEdit}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
              aria-label={editing ? "Cancel editing" : "Edit profile"}
            >
              <span className="material-symbols-outlined text-[18px]">
                {editing ? "close" : "edit"}
              </span>
            </button>
          </div>

          <h1 className="mt-space-md font-display text-headline-md text-on-surface">
            {profile.name}
          </h1>
          {editing ? (
            <input
              value={draft.username}
              onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value }))}
              placeholder="username"
              className={`${input} mt-space-xs`}
            />
          ) : (
            <p className="font-body text-body-md text-on-surface-variant">@{profile.username}</p>
          )}

          <div className="mt-space-sm space-y-space-xs">
            {editing ? (
              <>
                <input
                  value={draft.location}
                  onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                  placeholder="Location"
                  className={input}
                />
                <input
                  value={draft.experience_label}
                  onChange={(e) => setDraft((d) => ({ ...d, experience_label: e.target.value }))}
                  placeholder="e.g. Senior Competitive Hacker (4+ years)"
                  className={input}
                />
              </>
            ) : (
              <>
                {profile.location && (
                  <p className="flex items-center gap-space-xs text-on-surface-variant font-body text-body-sm">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    {profile.location}
                  </p>
                )}
                {profile.experience_label && (
                  <p className="flex items-center gap-space-xs text-on-surface-variant font-body text-body-sm">
                    <span className="material-symbols-outlined text-[16px]">military_tech</span>
                    {profile.experience_label}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-space-md flex gap-space-sm">
            <button
              type="button"
              disabled
              className="flex-1 py-2.5 rounded-xl bg-surface-container-low text-on-surface-variant font-display text-label-lg cursor-not-allowed"
              title="Messaging isn't built yet"
            >
              Message
            </button>
            {profile.resume_url ? (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-display text-label-lg text-center hover:bg-surface-tint transition-colors"
              >
                Resume
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="flex-1 py-2.5 rounded-xl bg-surface-container-low text-on-surface-variant font-display text-label-lg cursor-not-allowed"
              >
                No resume
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-gutter">
          <p className="font-display text-label-lg text-on-surface mb-space-sm">
            Academic &amp; bio
          </p>
          {editing ? (
            <div className="space-y-space-sm">
              <textarea
                value={draft.bio}
                onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                placeholder="Short bio"
                rows={3}
                maxLength={500}
                className={input}
              />
              <input
                value={draft.institution}
                onChange={(e) => setDraft((d) => ({ ...d, institution: e.target.value }))}
                placeholder="Institution (e.g. IIT Bombay)"
                className={input}
              />
              <input
                value={draft.degree}
                onChange={(e) => setDraft((d) => ({ ...d, degree: e.target.value }))}
                placeholder="Degree (e.g. B.Tech, Computer Science)"
                className={input}
              />
              <input
                value={draft.graduation_year}
                onChange={(e) => setDraft((d) => ({ ...d, graduation_year: e.target.value }))}
                placeholder="Graduation year"
                inputMode="numeric"
                className={input}
              />
            </div>
          ) : (
            <div className="space-y-space-sm font-body text-body-md">
              {profile.bio && <p className="text-on-surface leading-relaxed">{profile.bio}</p>}
              {(profile.institution || profile.degree || profile.graduation_year) && (
                <p className="text-on-surface-variant">
                  {[profile.degree, profile.institution, profile.graduation_year && `Class of ${profile.graduation_year}`]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              {!profile.bio && !profile.institution && (
                <p className="text-on-surface-variant/70 italic">No bio yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-gutter">
          <p className="font-display text-label-lg text-on-surface mb-space-sm">
            Connected channels
          </p>
          {editing ? (
            <div className="space-y-space-sm">
              <input
                value={draft.github}
                onChange={(e) => setDraft((d) => ({ ...d, github: e.target.value }))}
                placeholder="GitHub URL"
                className={input}
              />
              <input
                value={draft.linkedin}
                onChange={(e) => setDraft((d) => ({ ...d, linkedin: e.target.value }))}
                placeholder="LinkedIn URL"
                className={input}
              />
              <input
                value={draft.twitter}
                onChange={(e) => setDraft((d) => ({ ...d, twitter: e.target.value }))}
                placeholder="Twitter / X URL"
                className={input}
              />
              <input
                value={draft.portfolio}
                onChange={(e) => setDraft((d) => ({ ...d, portfolio: e.target.value }))}
                placeholder="Portfolio URL"
                className={input}
              />
              <input
                value={draft.resume_url}
                onChange={(e) => setDraft((d) => ({ ...d, resume_url: e.target.value }))}
                placeholder="Resume link"
                className={input}
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-space-sm">
              {[
                { key: "github", icon: "code", href: profile.socials?.github },
                { key: "linkedin", icon: "work", href: profile.socials?.linkedin },
                { key: "twitter", icon: "tag", href: profile.socials?.twitter },
                { key: "portfolio", icon: "language", href: profile.socials?.portfolio },
              ]
                .filter((c) => c.href)
                .map((c) => (
                  <a
                    key={c.key}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-low text-on-surface font-display text-label-md hover:bg-surface-container-high transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">{c.icon}</span>
                    {c.key}
                  </a>
                ))}
              {!profile.socials?.github &&
                !profile.socials?.linkedin &&
                !profile.socials?.twitter &&
                !profile.socials?.portfolio && (
                  <p className="text-on-surface-variant/70 italic font-body text-body-sm">
                    No channels linked yet.
                  </p>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Right column: competency + stats preview */}
      <div className="lg:col-span-7 space-y-gutter">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-gutter">
          <p className="font-display text-label-lg text-on-surface mb-space-sm">
            Competency &amp; tech arsenal
          </p>

          <div className="space-y-space-md">
            <div>
              <p className={label}>Primary specialization</p>
              {editing ? (
                <input
                  value={draft.primary_specialization}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, primary_specialization: e.target.value }))
                  }
                  placeholder="e.g. Distributed Backend & Cloud AI"
                  className={input}
                />
              ) : profile.primary_specialization ? (
                <p className="text-on-surface">{profile.primary_specialization}</p>
              ) : (
                <p className="text-on-surface-variant/70 italic">Not set</p>
              )}
            </div>

            <div>
              <p className={label}>Domain capabilities</p>
              <ChipInput
                values={editing ? draft.domain_capabilities : profile.domain_capabilities ?? []}
                onChange={(next) => setDraft((d) => ({ ...d, domain_capabilities: next }))}
                placeholder="Add a capability and press Enter"
                editable={editing}
                emptyLabel="No domain capabilities added yet."
              />
            </div>

            <div>
              <p className={label}>Core stack</p>
              <ChipInput
                values={editing ? draft.tech_stack : profile.tech_stack ?? []}
                onChange={(next) => setDraft((d) => ({ ...d, tech_stack: next }))}
                placeholder="Add a technology and press Enter"
                editable={editing}
                emptyLabel="No tech stack added yet."
              />
            </div>
          </div>
        </div>

        <StatsPreview />
      </div>

      {editing && (
        <div className="lg:col-span-12 sticky bottom-4 z-10">
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-lg px-gutter py-space-md flex items-center justify-between gap-space-md">
            <div className="min-w-0">
              {error ? (
                <p className="text-error font-body text-body-sm">{error}</p>
              ) : (
                <p className="text-on-surface-variant font-body text-body-sm">
                  Editing profile — changes aren&apos;t saved until you click Save.
                </p>
              )}
            </div>
            <div className="flex gap-space-sm shrink-0">
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="px-gutter py-space-sm rounded-xl border border-outline-variant text-on-surface font-display text-label-lg hover:bg-surface-container-low transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="px-gutter py-space-sm rounded-xl bg-primary text-on-primary font-display text-label-lg hover:bg-surface-tint transition-colors disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
