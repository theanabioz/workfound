'use client';

import { X, Phone, Mail, MapPin, Briefcase, User, MessageSquare, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
  onStatusChange: (id: string, status: string) => void;
}

export default function CandidateModal({ isOpen, onClose, application, onStatusChange }: CandidateModalProps) {
  if (!application) return null;

  const applicant = application.applicant;
  const initials = applicant?.full_name
    ? applicant.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : application.contact_email?.charAt(0).toUpperCase() || '?';

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
            className="relative w-full max-w-2xl bg-white border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-lg">
                  {initials}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
                    {applicant?.full_name || 'Имя не указано'}
                  </h2>
                  <p className="text-sm text-zinc-500 font-medium">
                    {applicant?.desired_position || 'Соискатель'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Контакты</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-zinc-600">
                      <Phone className="w-4 h-4 text-zinc-400" />
                      <span className="font-medium">{application.contact_phone || 'Не указан'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-600">
                      <Mail className="w-4 h-4 text-zinc-400" />
                      <span className="font-medium">{application.contact_email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-600">
                      <MapPin className="w-4 h-4 text-zinc-400" />
                      <span className="font-medium">{applicant?.location || 'Локация не указана'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Информация об отклике</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-zinc-600">
                      <Briefcase className="w-4 h-4 text-zinc-400" />
                      <span className="font-medium">{application.vacancies?.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-600">
                      <Clock className="w-4 h-4 text-zinc-400" />
                      <span className="font-medium">Отклик от {new Date(application.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-2">Статус:</div>
                      {application.status === 'new' && <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300">Новый</span>}
                      {application.status === 'review' && <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border bg-zinc-100 text-zinc-800 border-zinc-300">На рассмотрении</span>}
                      {application.status === 'accepted' && <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border bg-zinc-900 text-white border-zinc-900">Приглашен</span>}
                      {application.status === 'rejected' && <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border bg-white text-zinc-500 border-zinc-200">Отказ</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* About / Cover Letter */}
              <div className="space-y-6">
                {applicant?.about && (
                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                      <User className="w-3 h-3" />
                      О кандидате
                    </h3>
                    <div className="bg-zinc-50 p-4 border border-zinc-100 text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                      {applicant.about}
                    </div>
                  </section>
                )}

                {application.cover_letter && (
                  <section>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" />
                      Сопроводительное письмо
                    </h3>
                    <div className="bg-zinc-50 p-4 border border-zinc-100 text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap italic">
                      &quot;{application.cover_letter}&quot;
                    </div>
                  </section>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onStatusChange(application.id, 'accepted')}
                  disabled={application.status === 'accepted'}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Пригласить
                </button>
                <button 
                  onClick={() => onStatusChange(application.id, 'rejected')}
                  disabled={application.status === 'rejected'}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Отказать
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Link 
                  href={`/dashboard/employer/messages?seekerId=${application.applicant_id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Написать
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
