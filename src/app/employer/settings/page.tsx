'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile, getCurrentCompany, updateCompany } from '@/lib/supabase-service';
import { UserProfile, Company } from '@/types';
import { Save, User, Building2 } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'company'>('profile');
  
  // User State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Company State
  const [company, setCompany] = useState<Company | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [companySlug, setCompanySlug] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');

  useEffect(() => {
    const load = async () => {
      const [currentUser, currentCompany] = await Promise.all([
        getCurrentUser(),
        getCurrentCompany()
      ]);

      if (currentUser) {
        setUser(currentUser);
        setFullName(currentUser.fullName || '');
        setPhone(currentUser.phone || '');
      }

      if (currentCompany) {
        setCompany(currentCompany);
        setCompanyName(currentCompany.name || '');
        setCompanySlug(currentCompany.slug || '');
        setCompanyWebsite(currentCompany.website || '');
        setCompanyDesc(currentCompany.description || '');
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateProfile({ fullName, phone });
      alert('Профиль обновлен!');
    } catch (error) {
      console.error(error);
      alert('Ошибка');
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving company...', company);
    if (!company) {
      console.error('No company found in state');
      return;
    }
    try {
      await updateCompany({
        name: companyName,
        slug: companySlug,
        website: companyWebsite,
        description: companyDesc
      });
      console.log('Success update');
      alert('Компания обновлена!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Ошибка');
    }
  };

  if (loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Настройки</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-2 text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'profile' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
            }`}
          >
            <User className="w-4 h-4" /> Мой профиль
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`pb-3 px-2 text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'company' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
            }`}
          >
            <Building2 className="w-4 h-4" /> Компания
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="text"
                  disabled
                  className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-500"
                  value={user?.email}
                />
              </div>
              
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input 
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Сохранить
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveCompany} className="space-y-6">
              {/* Company Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название компании</label>
                <input 
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка (Slug)</label>
                <div className="flex items-center">
                  <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-gray-500 text-sm">
                    workfound.com/company/
                  </span>
                  <input 
                    type="text"
                    placeholder="google"
                    className="w-full rounded-r-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                    value={companySlug}
                    onChange={(e) => setCompanySlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Веб-сайт</label>
                <input 
                  type="url"
                  placeholder="https://example.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea 
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
                  value={companyDesc}
                  onChange={(e) => setCompanyDesc(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Сохранить компанию
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}