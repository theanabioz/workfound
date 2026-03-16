'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2, Phone, Mail, MessageSquare } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'motion/react';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  employerId: string;
}

export default function ApplyModal({ isOpen, onClose, jobId, jobTitle, employerId }: ApplyModalProps) {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [formData, setFormData] = useState({
    coverLetter: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function fetchUserProfile() {
    try {
      setIsLoadingProfile(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('phone, email')
        .eq('id', user.id)
        .single();

      setFormData({
        coverLetter: '',
        phone: profile?.phone || '',
        email: profile?.email || user.email || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Пожалуйста, войдите в систему, чтобы откликнуться на вакансию.');
      }

      // Check if already applied
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('vacancy_id', jobId)
        .eq('applicant_id', user.id)
        .maybeSingle();

      if (existingApplication) {
        throw new Error('Вы уже откликались на эту вакансию.');
      }

      const { error: submitError } = await supabase
        .from('applications')
        .insert([
          {
            vacancy_id: jobId,
            applicant_id: user.id,
            employer_id: employerId,
            status: 'new',
            cover_letter: formData.coverLetter,
            contact_phone: formData.phone,
            contact_email: formData.email,
          }
        ]);

      if (submitError) throw submitError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset state after closing
        setTimeout(() => {
          setSuccess(false);
          setFormData({ coverLetter: '', phone: '', email: '' });
        }, 300);
      }, 2000);

    } catch (err: any) {
      console.error('Error applying for job:', err);
      setError(err.message || 'Произошла ошибка при отправке отклика.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white border border-zinc-200 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Отклик на вакансию</h2>
                <p className="text-sm text-zinc-500 mt-1 truncate max-w-[300px] sm:max-w-md">{jobTitle}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {success ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-zinc-900" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">Отклик отправлен!</h3>
                  <p className="text-zinc-600">Работодатель скоро свяжется с вами.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-wider text-zinc-900 mb-2 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-zinc-400" />
                        Телефон
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={isLoadingProfile}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-colors text-sm font-medium disabled:opacity-50"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-zinc-900 mb-2 flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-zinc-400" />
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoadingProfile}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-colors text-sm font-medium disabled:opacity-50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="coverLetter" className="block text-[10px] font-bold uppercase tracking-wider text-zinc-900 mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3 text-zinc-400" />
                      Сопроводительное письмо
                    </label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white outline-none transition-colors resize-none text-sm font-medium"
                      placeholder="Расскажите о своем опыте и почему вы подходите на эту роль..."
                    ></textarea>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors order-2 sm:order-1"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoadingProfile}
                      className="flex-[2] bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3.5 font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed order-1 sm:order-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        'Отправить отклик'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
