'use client';

import { useState, useEffect } from 'react';
import { JobAlert, createJobAlert, getJobAlerts, deleteJobAlert } from '@/lib/supabase-service';
import { sendTestEmail } from '@/app/auth/actions'; // We'll create this action
import { Bell, MapPin, Search, Trash2, Mail } from 'lucide-react';

export default function JobAlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    setLoading(true);
    const data = await getJobAlerts();
    setAlerts(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywords && !location) return alert('Заполните хотя бы одно поле');
    
    setIsCreating(true);
    try {
      await createJobAlert({ keywords, location });
      setKeywords('');
      setLocation('');
      loadAlerts();
    } catch (error) {
      console.error(error);
      alert('Ошибка');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить подписку?')) return;
    try {
      await deleteJobAlert(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleTestEmail = async () => {
    try {
      alert('Отправляю тестовое письмо на вашу почту...');
      await sendTestEmail();
      alert('Письмо отправлено! Проверьте входящие (и спам).');
    } catch (error) {
      console.error(error);
      alert('Ошибка отправки: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Подписки на вакансии</h1>
            <p className="text-gray-500">Получайте уведомления о новых работах.</p>
          </div>
          <button 
            onClick={handleTestEmail}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <Mail className="w-4 h-4" /> Тест Email
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Create Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Создать подписку</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Должность / Ключевые слова</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input 
                      type="text" 
                      placeholder="Водитель"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Город</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input 
                      type="text" 
                      placeholder="Берлин"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Создание...' : 'Подписаться'}
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Загрузка...</div>
            ) : alerts.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-gray-200 text-center border-dashed">
                <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">У вас нет активных подписок.</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center group">
                  <div>
                    <h4 className="font-bold text-gray-900">{alert.keywords || 'Любая должность'}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {alert.location || 'Любая локация'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                      Активна
                    </span>
                    <button 
                      onClick={() => handleDelete(alert.id)}
                      className="text-gray-300 hover:text-red-500 p-2 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
