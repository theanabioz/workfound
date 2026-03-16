'use client';

import { Save, User, MapPin, Phone, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ResumePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    email: '',
    location: '',
    about: '',
    desired_position: ''
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
          phone: data.phone || '',
          email: data.email || user.email || '',
          location: data.location || '',
          about: data.about || '',
          desired_position: data.desired_position || ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        location: profile.location,
        about: profile.about,
        desired_position: profile.desired_position,
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
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Мое резюме</h1>
        <p className="text-sm text-slate-500 mt-1">Заполните профиль, чтобы работодатели могли вас найти</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Success Toast */}
        <div 
          className={`absolute top-4 right-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg shadow-sm flex items-center gap-3 transition-all duration-300 z-50 ${
            showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <div className="text-sm font-medium">Изменения сохранены</div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Basic Info */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Основная информация
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">ФИО</label>
                <input type="text" name="full_name" value={profile.full_name} onChange={handleChange} placeholder="Иванов Иван Иванович" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Желаемая должность</label>
                <input type="text" name="desired_position" value={profile.desired_position} onChange={handleChange} placeholder="Например: Водитель-дальнобойщик CE" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Телефон</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="tel" name="phone" value={profile.phone} onChange={handleChange} placeholder="+48 123 456 789" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="email" name="email" value={profile.email} onChange={handleChange} placeholder="alex.smirnov@example.com" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Текущее местоположение</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="text" name="location" value={profile.location} onChange={handleChange} placeholder="Варшава, Польша" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">О себе</label>
                <textarea name="about" value={profile.about} onChange={handleChange} rows={4} placeholder="Опыт работы по Европе более 5 лет..." className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm resize-none"></textarea>
              </div>
            </div>
          </section>

        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </div>
    </div>
  );
}
