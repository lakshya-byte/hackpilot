import { getProfileOrRedirect, getMyTeamOrRedirect } from "@/lib/session";
import IdeaEngineView from "@/components/ideas/idea-engine-view";

export default async function IdeasPage() {
  const [, team] = await Promise.all([getProfileOrRedirect(), getMyTeamOrRedirect()]);

  return (
    <div>
      <div className="mb-gutter">
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Idea Engine</h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Generate hackathon-winning ideas tailored to your team.
        </p>
      </div>
      <IdeaEngineView hasTeam={!!team} />
    </div>
  );
}
