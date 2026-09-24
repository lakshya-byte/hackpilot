import AuthHeader from "@/components/auth/auth-header";
import AuthFooter from "@/components/auth/auth-footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface font-body text-body-md text-on-surface min-h-screen flex flex-col">
      <AuthHeader />
      <main className="w-full flex-1 pt-16 bg-surface">{children}</main>
      <AuthFooter />
    </div>
  );
}
