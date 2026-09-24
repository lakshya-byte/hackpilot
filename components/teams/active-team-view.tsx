"use client";

import { useState } from "react";
import type { Team, TeamMember } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function ActiveTeamView({
  team: initialTeam,
  currentUserId,
  onTeamDeleted,
}: {
  team: Team;
  currentUserId: string;
  onTeamDeleted: () => void;
}) {
  const [team, setTeam] = useState(initialTeam);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isLead = team.lead_id === currentUserId;
  const myMembership = team.members.find((m) => m.user_id === currentUserId);
  const hasPendingInvite = myMembership?.status === "invited";

  const [editingHeader, setEditingHeader] = useState(false);
  const [nameDraft, setNameDraft] = useState(team.name);
  const [hackathonDraft, setHackathonDraft] = useState(team.hackathon);

  const [showInvite, setShowInvite] = useState(false);
  const [inviteUsername, setInviteUsername] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  async function respondToInvite(accept: boolean) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/teams/invite/${team.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't respond to the invite.");
        return;
      }
      if (!accept) {
        onTeamDeleted();
        return;
      }
      setTeam(data);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function saveHeader() {
    if (!nameDraft.trim() || !hackathonDraft.trim()) {
      setError("Team name and hackathon can't be empty.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/teams/${team.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameDraft.trim(), hackathon: hackathonDraft.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't save changes.");
        return;
      }
      setTeam(data);
      setEditingHeader(false);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function sendInvite() {
    if (!inviteUsername.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/teams/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: inviteUsername.trim().replace(/^@/, "") }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't send the invite.");
        return;
      }
      setTeam(data);
      setInviteUsername("");
      setShowInvite(false);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(userId: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/teams/members/${userId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't remove that member.");
        return;
      }
      setTeam((t) => ({ ...t, members: t.members.filter((m) => m.user_id !== userId) }));
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function transferLead(userId: string) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/teams/${team.id}/lead`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't transfer leadership.");
        return;
      }
      setTeam(data);
      setShowTransfer(false);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteTeam() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/teams/${team.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Couldn't delete the team.");
        setBusy(false);
        return;
      }
      onTeamDeleted();
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setBusy(false);
    }
  }

  const input =
    "w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all";

  return (
    <div>
      {hasPendingInvite && (
        <div className="mb-gutter rounded-2xl border border-primary-fixed-dim bg-primary-fixed/40 px-gutter py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[22px]">mail</span>
            <p className="font-body text-body-md text-on-surface">
              You&apos;ve been invited to join <span className="font-semibold">{team.name}</span>.
            </p>
          </div>
          <div className="flex gap-space-sm shrink-0">
            <button
              type="button"
              disabled={busy}
              onClick={() => respondToInvite(false)}
              className="px-gutter py-2 rounded-xl border border-outline-variant text-on-surface font-display text-label-md hover:bg-surface-container-low transition-colors disabled:opacity-60"
            >
              Decline
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => respondToInvite(true)}
              className="px-gutter py-2 rounded-xl bg-primary text-on-primary font-display text-label-md hover:bg-surface-tint transition-colors disabled:opacity-60"
            >
              Accept
            </button>
          </div>
        </div>
      )}

      <div className="mb-gutter flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
        <div>
          {editingHeader ? (
            <div className="flex flex-col gap-space-sm max-w-md">
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className={input}
                placeholder="Team name"
              />
              <input
                value={hackathonDraft}
                onChange={(e) => setHackathonDraft(e.target.value)}
                className={input}
                placeholder="Hackathon"
              />
              <div className="flex gap-space-sm">
                <button
                  type="button"
                  onClick={saveHeader}
                  disabled={busy}
                  className="px-gutter py-2 rounded-xl bg-primary text-on-primary font-display text-label-md hover:bg-surface-tint transition-colors disabled:opacity-60"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNameDraft(team.name);
                    setHackathonDraft(team.hackathon);
                    setEditingHeader(false);
                  }}
                  className="px-gutter py-2 rounded-xl border border-outline-variant text-on-surface font-display text-label-md hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-space-sm mb-2">
                <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
                  {team.name}
                </h1>
                {isLead && (
                  <button
                    type="button"
                    onClick={() => setEditingHeader(true)}
                    aria-label="Edit team"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                )}
                <div className="inline-flex items-center gap-space-xs bg-primary-fixed text-on-primary-fixed px-space-sm py-1.5 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
                  </span>
                  <span className="font-display text-label-md font-bold">{team.hackathon}</span>
                </div>
              </div>
              <p className="font-body text-body-md text-on-surface-variant flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[16px] text-primary">groups</span>
                {team.members.filter((m) => m.status === "active").length} active member
                {team.members.filter((m) => m.status === "active").length === 1 ? "" : "s"}
              </p>
            </>
          )}
        </div>

        {isLead && !editingHeader && (
          <div className="relative flex items-center gap-space-sm self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setShowTransfer((v) => !v)}
              className="flex items-center gap-space-xs bg-surface-container-lowest text-on-surface font-display text-label-md px-gutter py-2.5 rounded-xl shadow-sm hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">swap_horiz</span>
              Transfer Lead
            </button>
            {showTransfer && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest rounded-2xl p-2 z-30 shadow-[0_16px_40px_-6px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
                <div className="px-3 py-2 text-outline font-display text-label-caps uppercase tracking-wider">
                  Make lead
                </div>
                {team.members
                  .filter((m) => m.status === "active" && m.user_id !== currentUserId)
                  .map((m) => (
                    <button
                      key={m.user_id}
                      type="button"
                      onClick={() => transferLead(m.user_id)}
                      disabled={busy}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-on-surface hover:bg-surface-container font-display text-label-md text-left transition-colors disabled:opacity-60"
                    >
                      {m.name}
                    </button>
                  ))}
                {team.members.filter((m) => m.status === "active" && m.user_id !== currentUserId)
                  .length === 0 && (
                  <p className="px-3 py-2 font-body text-body-sm text-on-surface-variant/70 italic">
                    No other active members yet.
                  </p>
                )}
              </div>
            )}

            {confirmDelete ? (
              <div className="flex items-center gap-space-xs">
                <button
                  type="button"
                  onClick={deleteTeam}
                  disabled={busy}
                  className="px-gutter py-2.5 rounded-xl bg-error text-on-error font-display text-label-md hover:opacity-90 transition-all disabled:opacity-60"
                >
                  Confirm delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-gutter py-2.5 rounded-xl border border-outline-variant text-on-surface font-display text-label-md hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-space-xs text-error font-display text-label-md px-gutter py-2.5 rounded-xl hover:bg-error-container/40 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">delete_outline</span>
                Delete Team
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p className="mb-space-md text-error font-body text-body-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {team.members.map((m) => (
          <MemberCard
            key={m.user_id}
            member={m}
            isLead={m.user_id === team.lead_id}
            isSelf={m.user_id === currentUserId}
            canManage={isLead && m.user_id !== team.lead_id}
            busy={busy}
            onRemove={() => removeMember(m.user_id)}
          />
        ))}

        {isLead && (
          <div className="group border-2 border-dashed border-primary/30 hover:border-primary bg-primary-fixed/20 hover:bg-primary-fixed/40 transition-all rounded-3xl p-gutter flex flex-col items-center justify-center text-center min-h-[220px]">
            {showInvite ? (
              <div className="w-full flex flex-col gap-space-sm">
                <label className="font-display text-label-md text-on-surface font-semibold">
                  Invite by username
                </label>
                <input
                  autoFocus
                  value={inviteUsername}
                  onChange={(e) => setInviteUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendInvite()}
                  placeholder="username"
                  className="w-full bg-surface-container-lowest text-on-surface font-body text-body-sm rounded-xl px-space-sm py-2 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all"
                />
                <div className="flex gap-space-xs">
                  <button
                    type="button"
                    onClick={sendInvite}
                    disabled={busy}
                    className="flex-1 py-2 rounded-xl bg-primary text-on-primary font-display text-label-md hover:bg-surface-tint transition-colors disabled:opacity-60"
                  >
                    Invite
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInvite(false)}
                    className="px-space-sm py-2 rounded-xl border border-outline-variant text-on-surface font-display text-label-md hover:bg-surface-container-low transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setShowInvite(true)} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-[0_4px_16px_rgba(79,70,229,0.25)] group-hover:scale-110 transition-transform mb-space-sm">
                  <span className="material-symbols-outlined text-[28px]">person_add</span>
                </div>
                <h3 className="font-display text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                  Invite Member
                </h3>
                <p className="font-body text-body-sm text-outline mt-1.5 max-w-[200px]">
                  Add a teammate by their HackPilot username.
                </p>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MemberCard({
  member,
  isLead,
  isSelf,
  canManage,
  busy,
  onRemove,
}: {
  member: TeamMember;
  isLead: boolean;
  isSelf: boolean;
  canManage: boolean;
  busy: boolean;
  onRemove: () => void;
}) {
  const pending = member.status === "invited";

  return (
    <div
      className={`rounded-3xl p-gutter flex flex-col justify-between relative overflow-hidden transition-all ${
        pending
          ? "bg-surface-container-lowest/80 border border-outline-variant"
          : isLead
            ? "bg-surface-container-lowest shadow-[0_8px_30px_rgba(79,70,229,0.08)] ring-2 ring-primary-container/20"
            : "bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)]"
      }`}
    >
      {isLead && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary-container to-secondary" />
      )}
      <div>
        <div className="flex items-center justify-between mb-space-sm">
          {pending ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-display text-label-caps uppercase">
              <span className="material-symbols-outlined text-[14px] text-outline">mail</span>
              Invite Sent
            </span>
          ) : isLead ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-display text-label-caps font-bold">
              <span>👑</span>
              <span>Team Lead</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-display text-label-caps font-bold uppercase">
              Member
            </span>
          )}
          {!pending && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-display text-label-caps font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Active
            </span>
          )}
        </div>

        <div className="flex items-start gap-space-md mb-space-sm">
          {member.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photo_url}
              alt={member.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-surface-container shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-display text-label-lg shrink-0">
              {pending ? (
                <span className="material-symbols-outlined text-[26px]">person_outline</span>
              ) : (
                initials(member.name)
              )}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-display text-headline-sm text-on-surface truncate">
              {member.name}
              {isSelf ? " (You)" : ""}
            </span>
            {member.username && (
              <span className="font-body text-body-sm text-outline">@{member.username}</span>
            )}
          </div>
        </div>

        {member.primary_skill && (
          <div className="mb-space-sm">
            <span className="inline-block bg-primary-fixed/60 text-primary font-display text-label-md px-3 py-1 rounded-xl">
              {member.primary_skill}
            </span>
          </div>
        )}
      </div>

      {canManage && (
        <div className="pt-space-sm border-t border-surface-container flex items-center justify-end">
          <button
            type="button"
            disabled={busy}
            onClick={onRemove}
            className="text-error font-display text-label-md hover:underline flex items-center gap-1 disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[16px]">person_remove</span>
            {pending ? "Cancel invite" : "Remove"}
          </button>
        </div>
      )}
    </div>
  );
}
