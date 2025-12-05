'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile } from '@/lib/supabase-service';
import { UserProfile } from '@/types';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Form Fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const load = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setFullName(currentUser.fullName || '');
        setCompanyName(currentUser.companyName || '');
        setPhone(currentUser.phone || '');
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        fullName,
        companyName,
        phone
      });
      alert('Профиль обновлен!');
    } catch (error) {
      console.error(error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Настройки профиля</h1>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
                <input 
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название компании</label>
                <input 
                  type="text"
                  placeholder="ООО Пример"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон для связи (по умолчанию)</label>
              <input 
                type="text"
                placeholder="+49 ..."
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Будет подставляться автоматически при создании вакансии.</p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
