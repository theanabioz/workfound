import { getCurrentUser } from '@/lib/supabase-service';
import { ChatSystem } from '@/components/ChatSystem';

export default async function MessagesPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return <div>Доступ запрещен</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Сообщения</h1>
        <ChatSystem currentUserId={currentUser.id} />
      </div>
    </div>
  );
}
