'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Video, Phone, Calendar as CalendarIcon, User, AlignLeft, Check } from 'lucide-react';
import { createEvent, getEmployerApplications } from '@/lib/supabase-service';
import { Application } from '@/types';

interface EventModalProps {
  date: Date;
  onClose: () => void;
  onEventCreated: () => void;
}

export function EventModal({ date, onClose, onEventCreated }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState('60'); // minutes
  const [type, setType] = useState<'interview' | 'call'>('interview');
  const [description, setDescription] = useState('');
  
  // Candidate Selection
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load candidates for dropdown
  useEffect(() => {
    const load = async () => {
      setIsLoadingCandidates(true);
      // В реальности здесь нужен поиск, но пока загрузим всех активных
      // Нам нужен employerId... На клиенте его нет.
      // Хак: загрузим через серверный action, который сам знает юзера
      // Придется добавить спец функцию getMyCandidates()
      // Пока оставим пустым или сделаем TODO
      setIsLoadingCandidates(false);
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const start = new Date(date);
    const [hours, minutes] = time.split(':');
    start.setHours(parseInt(hours), parseInt(minutes));
    
    const end = new Date(start.getTime() + parseInt(duration) * 60000);

    try {
      await createEvent({
        title: title || 'Без названия',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        eventType: type,
        description,
        applicationId: selectedCandidateId || undefined
      });
      onEventCreated();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Ошибка создания');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900">Новое событие</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Title Input (Big) */}
          <div>
            <input 
              autoFocus
              type="text" 
              placeholder="Добавьте название"
              className="w-full text-xl font-bold border-none focus:ring-0 p-0 placeholder-gray-400 text-gray-900"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Type Switcher */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('interview')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                type === 'interview' ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Интервью
            </button>
            <button
              type="button"
              onClick={() => setType('call')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                type === 'call' ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> Созвон
            </button>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                {date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="time" 
                  className="bg-white border border-gray-200 rounded-md text-sm px-2 py-1 w-24 focus:ring-black focus:border-black"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <span className="text-gray-400 text-sm">на</span>
                <select
                  className="bg-white border border-gray-200 rounded-md text-sm px-2 py-1 flex-1 focus:ring-black focus:border-black"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="15">15 мин</option>
                  <option value="30">30 мин</option>
                  <option value="45">45 мин</option>
                  <option value="60">1 час</option>
                  <option value="90">1.5 часа</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex gap-3">
            <AlignLeft className="w-5 h-5 text-gray-400 mt-1" />
            <textarea 
              placeholder="Добавить описание..."
              rows={3}
              className="w-full bg-gray-50 border-none rounded-lg text-sm focus:ring-1 focus:ring-black resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Candidate (Placeholder for now) */}
          {/* 
          <div className="flex gap-3 items-center opacity-50">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Привязать кандидата (Скоро)</span>
          </div> 
          */}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50 shadow-lg shadow-gray-200"
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>

      </div>
    </div>
  );
}