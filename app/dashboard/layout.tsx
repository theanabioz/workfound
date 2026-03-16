import Header from '@/components/layout/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import BottomNav from '@/components/dashboard/BottomNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans pb-16 md:pb-0">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
