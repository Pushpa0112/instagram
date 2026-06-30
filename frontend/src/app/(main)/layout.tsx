import Sidebar from "@/components/shared/Sidebar";
import BottomNav from "@/components/shared/BottomNav";
import SearchModal from "@/components/shared/SearchModal";
import CreatePostModal from "@/components/shared/CreatePostModal";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <BottomNav />
      <SearchModal />
      <CreatePostModal />
      
      <main className="flex-1 md:ml-[72px] lg:ml-64 pb-12 md:pb-0 relative min-h-screen">
        {children}
      </main>
    </div>
  );
}
