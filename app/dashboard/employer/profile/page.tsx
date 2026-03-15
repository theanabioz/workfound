'use client';

import { Save, Building, MapPin, Globe, Mail, Phone, UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function EmployerProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    full_name: '',
    industry: '',
    company_size: '',
    about: '',
    address: '',
    website: '',
    email: '',
    phone: ''
  });

  const supabase = createClient();

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProfile() {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Необходима авторизация');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          industry: data.industry || '',
          company_size: data.company_size || '',
          about: data.about || '',
          address: data.location || '',
          website: data.website || '',
          email: data.email || user.email || '',
          phone: data.phone || ''
        });
      } else {
        setProfile(prev => ({ ...prev, email: user.email || '' }));
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError('Не удалось загрузить профиль.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Необходима авторизация');

      const updates = {
        id: user.id,
        role: 'employer',
        full_name: profile.full_name,
        phone: profile.phone,
        industry: profile.industry,
        company_size: profile.company_size,
        about: profile.about,
        location: profile.address,
        website: profile.website,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError('Ошибка при сохранении профиля.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Профиль компании</h1>
        <p className="text-sm text-slate-500 mt-1">Информация о вашей компании для соискателей</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden relative">
        {/* Success Toast */}
        <div 
          className={`absolute top-4 right-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg shadow-sm flex items-center gap-3 transition-all duration-300 z-50 ${
            showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <div className="text-sm font-medium">Профиль успешно обновлен</div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Logo & Cover */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Логотип компании</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-colors cursor-pointer">
                <UploadCloud className="w-6 h-6 mb-1 text-slate-400" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Загрузить</span>
              </div>
              <div className="text-sm text-slate-500">
                <p className="font-medium text-slate-700 mb-1">Рекомендуемый размер: 400x400px</p>
                <p>Форматы: JPG, PNG. Максимальный вес: 2MB.</p>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Basic Info */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              Основная информация
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Название компании</label>
                <input type="text" name="full_name" value={profile.full_name} onChange={handleChange} placeholder="Название компании" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Отрасль</label>
                <select name="industry" value={profile.industry} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm appearance-none">
                  <option value="">Выберите отрасль</option>
                  <option value="Транспорт и логистика">Транспорт и логистика</option>
                  <option value="Строительство">Строительство</option>
                  <option value="Производство">Производство</option>
                  <option value="ИТ и Телеком">ИТ и Телеком</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Размер компании</label>
                <select name="company_size" value={profile.company_size} onChange={handleChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm appearance-none">
                  <option value="">Выберите размер</option>
                  <option value="1-10 сотрудников">1-10 сотрудников</option>
                  <option value="10-50 сотрудников">10-50 сотрудников</option>
                  <option value="50-200 сотрудников">50-200 сотрудников</option>
                  <option value="Более 200 сотрудников">Более 200 сотрудников</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Описание компании</label>
                <textarea name="about" value={profile.about} onChange={handleChange} rows={5} placeholder="Опишите вашу компанию..." className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm resize-none"></textarea>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Contacts */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Контакты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Штаб-квартира (Адрес)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="text" name="address" value={profile.address} onChange={handleChange} placeholder="Город, Страна, Улица" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Сайт</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="url" name="website" value={profile.website} onChange={handleChange} placeholder="https://example.com" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email для связи</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="contact@example.com" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Телефон</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="tel" name="phone" value={profile.phone} onChange={handleChange} placeholder="+1 234 567 8900" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Отмена
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
