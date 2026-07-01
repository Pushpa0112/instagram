import Sidebar from "@/components/shared/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar container - fixed width on desktop, icon only on tablet */}
      <div className="hidden sm:block fixed inset-y-0 z-50 w-20 lg:w-64">
        <Sidebar />
      </div>
      
      {/* Bottom navigation for mobile (To be added later if needed) */}
      
      {/* Main content area */}
      <main className="flex-1 w-full sm:ml-20 lg:ml-64">
        {children}
      </main>
    </div>
  );
}
