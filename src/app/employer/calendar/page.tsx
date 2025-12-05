'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent, getEvents } from '@/lib/supabase-service';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay,
  isToday
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Video, Phone } from 'lucide-react';
import { EventModal } from '@/components/EventModal';

export default function AppleCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  // --- Calendar Logic ---
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Пн
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToday = () => setCurrentDate(new Date());

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setIsModalOpen(true);
  };

  // Helper to get events for a day
  const getEventsForDay = (day: Date) => {
    return events.filter(e => isSameDay(new Date(e.startTime), day));
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {format(currentDate, 'LLLL yyyy', { locale: ru })}
          </h1>
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button onClick={prevMonth} className="p-1 hover:bg-white rounded shadow-sm transition-all">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={goToday} className="px-3 py-1 text-xs font-medium text-gray-700 hover:bg-white rounded shadow-sm transition-all mx-0.5">
              Сегодня
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-white rounded shadow-sm transition-all">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => { setSelectedDate(new Date()); setIsModalOpen(true); }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2 shadow-md shadow-red-200"
        >
          <Plus className="w-4 h-4" /> Событие
        </button>
      </div>

      {/* GRID HEADER (Weekdays) */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 shrink-0">
        {weekDays.map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* GRID BODY */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto bg-gray-100 gap-px border-gray-200">
        {calendarDays.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isTodayDay = isToday(day);

          return (
            <div 
              key={day.toISOString()} 
              onClick={() => handleDayClick(day)}
              className={`bg-white relative p-2 min-h-[120px] cursor-pointer transition-colors hover:bg-gray-50 group flex flex-col gap-1 ${
                !isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : ''
              }`}
            >
              {/* Day Number */}
              <div className="flex justify-end">
                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${
                  isTodayDay 
                    ? 'bg-red-500 text-white shadow-md shadow-red-200' 
                    : 'text-gray-700 group-hover:bg-gray-200'
                }`}>
                  {format(day, 'd')}
                </span>
              </div>

              {/* Events Stack */}
              <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                {dayEvents.slice(0, 4).map(event => (
                  <div 
                    key={event.id}
                    className={`px-2 py-1 rounded text-[10px] font-medium truncate flex items-center gap-1.5 shadow-sm border-l-2 ${
                      event.eventType === 'interview' 
                        ? 'bg-purple-50 text-purple-700 border-purple-400' 
                        : 'bg-blue-50 text-blue-700 border-blue-400'
                    }`}
                  >
                    {/* Icon (Optional, takes space) */}
                    {/* {event.eventType === 'interview' ? <Video className="w-3 h-3 shrink-0" /> : <Phone className="w-3 h-3 shrink-0" />} */}
                    
                    <span className="font-bold">
                      {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
                
                {dayEvents.length > 4 && (
                  <div className="text-[10px] text-gray-400 pl-1">
                    Еще {dayEvents.length - 4}...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && selectedDate && (
        <EventModal 
          date={selectedDate} 
          onClose={() => setIsModalOpen(false)} 
          onEventCreated={loadEvents} 
        />
      )}
    </div>
  );
}
