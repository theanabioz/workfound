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
        full_name: profile.full_name,
        phone: profile.phone,
        email: profile.email,
        industry: profile.industry,
        company_size: profile.company_size,
        about: profile.about,
        location: profile.address,
        website: profile.website,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

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
        <Loader2 className="w-8 h-8 animate-spin text-zinc-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Профиль компании</h1>
        <p className="text-sm text-zinc-500 mt-1 uppercase tracking-wider font-medium">Информация о вашей компании для соискателей</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white border border-zinc-200 overflow-hidden relative">
        {/* Success Toast */}
        <div 
          className={`absolute top-4 right-4 bg-zinc-900 border border-zinc-900 text-white px-4 py-3 flex items-center gap-3 transition-all duration-300 z-50 ${
            showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div className="text-xs font-bold uppercase tracking-wider">Профиль успешно обновлен</div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Logo & Cover */}
          <section>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">Логотип компании</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-zinc-50 border border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:border-zinc-400 transition-colors cursor-pointer">
                <UploadCloud className="w-6 h-6 mb-1 text-zinc-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Загрузить</span>
              </div>
              <div className="text-xs text-zinc-500 font-medium">
                <p className="font-bold text-zinc-700 mb-1 uppercase tracking-wider">Рекомендуемый размер: 400x400px</p>
                <p>Форматы: JPG, PNG. Максимальный вес: 2MB.</p>
              </div>
            </div>
          </section>

          <hr className="border-zinc-200" />

          {/* Basic Info */}
          <section>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-zinc-400" />
              Основная информация
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Название компании</label>
                <input type="text" name="full_name" value={profile.full_name} onChange={handleChange} placeholder="Название компании" className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors text-sm font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Отрасль</label>
                <select name="industry" value={profile.industry} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors text-sm appearance-none font-medium">
                  <option value="">Выберите отрасль</option>
                  <option value="Транспорт и логистика">Транспорт и логистика</option>
                  <option value="Строительство">Строительство</option>
                  <option value="Производство">Производство</option>
                  <option value="ИТ и Телеком">ИТ и Телеком</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Размер компании</label>
                <select name="company_size" value={profile.company_size} onChange={handleChange} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors text-sm appearance-none font-medium">
                  <option value="">Выберите размер</option>
                  <option value="1-10 сотрудников">1-10 сотрудников</option>
                  <option value="10-50 сотрудников">10-50 сотрудников</option>
                  <option value="50-200 сотрудников">50-200 сотрудников</option>
                  <option value="Более 200 сотрудников">Более 200 сотрудников</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Описание компании</label>
                <textarea name="about" value={profile.about} onChange={handleChange} rows={5} placeholder="Опишите вашу компанию..." className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors text-sm resize-none font-medium"></textarea>
              </div>
            </div>
          </section>

          <hr className="border-zinc-200" />

          {/* Contacts */}
          <section>
            <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">Контакты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Штаб-квартира (Адрес)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-4 top-3" />
                  <input type="text" name="address" value={profile.address} onChange={handleChange} placeholder="Город, Страна, Улица" className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Сайт</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-zinc-400 absolute left-4 top-3" />
                  <input type="url" name="website" value={profile.website} onChange={handleChange} placeholder="https://example.com" className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Email для связи</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-4 top-3" />
                  <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="contact@example.com" className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-700 mb-1.5">Телефон</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-4 top-3" />
                  <input type="tel" name="phone" value={profile.phone} onChange={handleChange} placeholder="+1 234 567 8900" className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-colors text-sm font-medium" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-3">
          <button className="px-6 py-2.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 uppercase tracking-wider transition-colors">
            Отмена
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
