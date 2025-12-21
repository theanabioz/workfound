'use client';

import { useState, useEffect } from 'react';
import { getCompanyMembers, getInvitations, inviteMember, Invitation } from '@/lib/supabase-service';
import { CompanyMember } from '@/types';
import { UserPlus, Mail, Clock, User, Check } from 'lucide-react';

export default function TeamPage() {
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [m, i] = await Promise.all([getCompanyMembers(), getInvitations()]);
    setMembers(m);
    setInvitations(i);
    setLoading(false);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      await inviteMember(inviteEmail, 'recruiter');
      alert('Приглашение отправлено!');
      setInviteEmail('');
      loadData();
    } catch (error) {
      console.error(error);
      alert('Ошибка отправки');
    } finally {
      setIsInviting(false);
    }
  };

  if (loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Команда</h1>

        {/* Invite Form */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Пригласить сотрудника
          </h3>
          <form onSubmit={handleInvite} className="flex gap-4">
            <input 
              type="email" 
              required
              placeholder="colleague@company.com"
              className="flex-1 rounded-lg border-gray-300 px-4 py-2 text-sm"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={isInviting}
              className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isInviting ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Members List */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Сотрудники ({members.length})</h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {members.map(m => (
                <div key={m.id} className="p-4 border-b border-gray-100 last:border-0 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                    {m.profile?.fullName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{m.profile?.fullName}</p>
                    <p className="text-xs text-gray-500 capitalize">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invitations List */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Отправленные приглашения</h3>
            {invitations.length === 0 ? (
              <div className="text-gray-400 text-sm italic">Нет активных приглашений</div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {invitations.map(i => (
                  <div key={i.id} className="p-4 border-b border-gray-100 last:border-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{i.email}</p>
                        <p className="text-xs text-gray-500">Ожидает принятия</p>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-orange-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
