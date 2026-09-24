import { getProfileOrRedirect } from "@/lib/session";
import ProfileView from "@/components/profile/profile-view";

export default async function ProfilePage() {
  const profile = await getProfileOrRedirect();

  return (
    <div>
      <div className="mb-gutter">
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Profile</h1>
        <p className="font-body text-body-md text-on-surface-variant">
          This is how your squad and jury see you.
        </p>
      </div>
      <ProfileView profile={profile} />
    </div>
  );
}
