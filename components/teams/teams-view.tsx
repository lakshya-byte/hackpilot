"use client";

import { useState } from "react";
import type { Team } from "@/lib/types";
import NoTeamState from "./no-team-state";
import CreateTeamModal from "./create-team-modal";
import ActiveTeamView from "./active-team-view";

export default function TeamsView({
  team: initialTeam,
  currentUserId,
}: {
  team: Team | null;
  currentUserId: string;
}) {
  const [team, setTeam] = useState(initialTeam);
  const [showModal, setShowModal] = useState(false);

  if (!team) {
    return (
      <>
        <NoTeamState onCreate={() => setShowModal(true)} />
        {showModal && (
          <CreateTeamModal
            onClose={() => setShowModal(false)}
            onCreated={(created) => {
              setTeam(created);
              setShowModal(false);
            }}
          />
        )}
      </>
    );
  }

  return (
    <ActiveTeamView team={team} currentUserId={currentUserId} onTeamDeleted={() => setTeam(null)} />
  );
}
