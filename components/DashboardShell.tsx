import Sidebar from "./Sidebar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-dashboard px-4 py-7 sm:px-6 md:px-10 md:py-9 lg:px-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
