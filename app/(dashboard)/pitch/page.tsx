import { getProfileOrRedirect, getMyTeamOrRedirect } from "@/lib/session";
import PitchView from "@/components/pitch/pitch-view";
import ProGate from "@/components/billing/pro-gate";

export default async function PitchPage() {
  const [, team] = await Promise.all([getProfileOrRedirect(), getMyTeamOrRedirect()]);

  return (
    <div>
      <div className="mb-gutter">
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Pitch Builder</h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Turn a shortlisted idea and a judging rubric into a timed, rubric-aligned pitch deck.
        </p>
      </div>
      <ProGate>
        <PitchView hasTeam={!!team} teamId={team?.id ?? null} />
      </ProGate>
    </div>
  );
}
