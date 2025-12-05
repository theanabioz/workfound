import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Application, Resume } from '@/types';
import { Note, getNotes, addNote, deleteNote, startConversation } from '@/lib/supabase-service';
import { X, User, Briefcase, MessageSquare, Trash2, Send, Mail } from 'lucide-react';

type AppWithDetails = Application & { jobTitle: string; resume?: Resume };

interface ModalProps {
  app: AppWithDetails;
  onClose: () => void;
}

export function ApplicationModal({ app, onClose }: ModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'notes'>('info');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Load notes when tab changes to 'notes'
  useEffect(() => {
    if (activeTab === 'notes') {
      setLoadingNotes(true);
      getNotes(app.id).then(data => {
        setNotes(data);
        setLoadingNotes(false);
      });
    }
  }, [activeTab, app.id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const tempId = Math.random().toString();
    const optimisticNote = {
      id: tempId,
      applicationId: app.id,
      authorId: 'me',
      content: newNote,
      createdAt: new Date().toISOString(),
      author: { fullName: 'Я' }
    };

    setNotes(prev => [...prev, optimisticNote]);
    setNewNote('');

    try {
      const realNote = await addNote(app.id, optimisticNote.content);
      setNotes(prev => prev.map(n => n.id === tempId ? realNote : n));
    } catch (error) {
      console.error(error);
      setNotes(prev => prev.filter(n => n.id !== tempId)); // Revert
    }
  };

  const handleDelete = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    await deleteNote(id);
  };

  const handleStartChat = async () => {
    try {
      await startConversation(app.seekerId, app.jobId);
      router.push('/employer/messages');
    } catch (error) {
      console.error(error);
      alert('Ошибка создания чата');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500">
              {app.resume?.fullName?.charAt(0).toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {app.resume ? app.resume.fullName : 'Кандидат'}
              </h2>
              <p className="text-sm text-gray-500">{app.jobTitle}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleStartChat}
              className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 px-4 text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              Написать
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'info' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Информация
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'notes' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Заметки
            {notes.length > 0 && <span className="bg-gray-100 px-1.5 rounded-full text-xs">{notes.length}</span>}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          {activeTab === 'info' ? (
            <div className="space-y-6">
              {/* Resume Info */}
              {app.resume ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" /> О себе
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{app.resume.about}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-2 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Опыт
                    </h3>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{app.resume.experience}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Навыки</h3>
                    <div className="flex flex-wrap gap-2">
                      {app.resume.skills.split(',').map((s, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 border border-gray-200">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 italic">Нет данных резюме.</div>
              )}

              {/* Cover Letter */}
              {app.coverLetter && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-900 uppercase mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Сопроводительное письмо
                  </h3>
                  <p className="text-blue-900 text-sm italic">"{app.coverLetter}"</p>
                </div>
              )}
            </div>
          ) : (
            // NOTES TAB
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-4 mb-4 min-h-[300px]">
                {loadingNotes ? (
                  <div className="text-center py-8 text-gray-400">Загрузка...</div>
                ) : notes.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 italic border-2 border-dashed border-gray-200 rounded-lg">
                    Заметок пока нет. Напишите что-нибудь важное.
                  </div>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm group relative">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-gray-900">{note.author?.fullName}</span>
                        <span className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{note.content}</p>
                      
                      <button 
                        onClick={() => handleDelete(note.id)}
                        className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddNote} className="relative">
                <input
                  type="text"
                  placeholder="Добавить заметку..."
                  className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none shadow-sm"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newNote.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
