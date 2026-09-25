import { getProfileOrRedirect, getMyTeamOrRedirect } from "@/lib/session";
import ChecklistView from "@/components/checklist/checklist-view";

export default async function ChecklistPage() {
  const [, team] = await Promise.all([getProfileOrRedirect(), getMyTeamOrRedirect()]);

  return (
    <div>
      <div className="mb-gutter">
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Pre-Hack Checklist</h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Everything your team should lock down before the clock starts.
        </p>
      </div>
      <ChecklistView hasTeam={!!team} hackathonId={team?.hackathon ?? null} />
    </div>
  );
}
