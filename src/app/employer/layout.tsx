import { DashboardSidebar } from '@/components/DashboardSidebar';

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar фиксирован слева */}
      <DashboardSidebar role="employer" userName="Hans Mueller" />
      
      {/* Контент смещен вправо (только на десктопе) */}
      <div className="md:ml-64">
        {children}
      </div>
    </div>
  );
}
