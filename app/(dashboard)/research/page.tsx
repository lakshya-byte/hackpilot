import { getProfileOrRedirect, getMyTeamOrRedirect } from "@/lib/session";
import ResearchEngineView from "@/components/research/research-engine-view";

export default async function ResearchPage() {
  const [, team] = await Promise.all([getProfileOrRedirect(), getMyTeamOrRedirect()]);

  return (
    <div>
      <div className="mb-gutter">
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Research Engine</h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Validate your idea against the market before you build it.
        </p>
      </div>
      <ResearchEngineView hasTeam={!!team} />
    </div>
  );
}
