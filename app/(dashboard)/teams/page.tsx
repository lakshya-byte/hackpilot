import { getProfileOrRedirect, getMyTeamOrRedirect } from "@/lib/session";
import TeamsView from "@/components/teams/teams-view";

export default async function TeamsPage() {
  const [profile, team] = await Promise.all([getProfileOrRedirect(), getMyTeamOrRedirect()]);

  return (
    <div>
      <div className="mb-gutter">
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Teams</h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Assemble your squad and manage who&apos;s building with you.
        </p>
      </div>
      <TeamsView team={team} currentUserId={profile.id} />
    </div>
  );
}
