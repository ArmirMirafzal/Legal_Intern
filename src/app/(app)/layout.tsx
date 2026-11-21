import { AppHeader } from "@/components/layout/AppHeader";
import { DemoModeBanner } from "@/components/layout/DemoModeBanner";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <DemoModeBanner />
      <AppHeader />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
