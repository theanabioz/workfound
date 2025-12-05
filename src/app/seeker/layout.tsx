import { DashboardSidebar } from '@/components/DashboardSidebar';

export default function SeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar role="seeker" userName="Ivan Petrov" />
      <div className="md:ml-64">
        {children}
      </div>
    </div>
  );
}
