import { getProfileOrRedirect, getMyTeamOrRedirect } from "@/lib/session";
import FrameworkView from "@/components/framework/framework-view";

export default async function FrameworkPage() {
  const [, team] = await Promise.all([getProfileOrRedirect(), getMyTeamOrRedirect()]);

  return (
    <div>
      <div className="mb-gutter">
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Win Framework</h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Budget your hackathon hours across ideation, build, and pitch prep.
        </p>
      </div>
      <FrameworkView hasTeam={!!team} teamId={team?.id ?? null} />
    </div>
  );
}
