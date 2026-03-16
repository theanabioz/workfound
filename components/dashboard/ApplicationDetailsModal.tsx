'use client';

import { X, Mail, Phone, MessageSquare, CheckCircle2, XCircle, Clock, ExternalLink, Loader2, Calendar, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: any;
  onStatusChange: (id: string, status: string) => Promise<void>;
}

export default function ApplicationDetailsModal({ isOpen, onClose, application, onStatusChange }: ApplicationDetailsModalProps) {
  if (!application) return null;

  const statusConfig = {
    new: { label: 'Новый', color: 'bg-zinc-100 text-zinc-800 border-zinc-300' },
    review: { label: 'На рассмотрении', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    accepted: { label: 'Приглашен', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Отказ', color: 'bg-red-50 text-red-700 border-red-200' },
  };

  const currentStatus = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.new;

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
                <div className="w-12 h-12 bg-zinc-100 text-zinc-600 flex items-center justify-center font-bold text-lg border border-zinc-200">
                  {application.contact_email ? application.contact_email.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{application.contact_email}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${currentStatus.color}`}>
                      {currentStatus.label}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(application.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
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
              {/* Job Info */}
              <section>
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Вакансия</h3>
                <Link 
                  href={`/jobs/${application.vacancy_id}`}
                  className="group flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 hover:bg-white hover:border-zinc-900 transition-all"
                >
                  <div className="font-bold text-zinc-900">{application.vacancies?.title}</div>
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                </Link>
              </section>

              {/* Contact Info */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-zinc-100 bg-zinc-50/50">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    Email
                  </h3>
                  <div className="text-sm font-medium text-zinc-900">{application.contact_email}</div>
                </div>
                <div className="p-4 border border-zinc-100 bg-zinc-50/50">
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    Телефон
                  </h3>
                  <div className="text-sm font-medium text-zinc-900">{application.contact_phone}</div>
                </div>
              </section>

              {/* Cover Letter */}
              <section>
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3" />
                  Сопроводительное письмо
                </h3>
                <div className="p-6 bg-zinc-50 border border-zinc-100 text-zinc-700 text-sm leading-relaxed whitespace-pre-wrap italic">
                  {application.cover_letter || 'Кандидат не оставил сопроводительного письма.'}
                </div>
              </section>
            </div>

            {/* Footer Actions */}
            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <Link 
                  href="/dashboard/employer/messages"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <Mail className="w-4 h-4" />
                  Написать
                </Link>
                <a 
                  href={`https://wa.me/${application.contact_phone?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 hover:border-emerald-500 hover:text-emerald-600 transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>

              <div className="flex items-center gap-2">
                {application.status !== 'rejected' && (
                  <button 
                    onClick={() => onStatusChange(application.id, 'rejected')}
                    className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    <XCircle className="w-4 h-4" />
                    Отказ
                  </button>
                )}
                {application.status !== 'accepted' && (
                  <button 
                    onClick={() => onStatusChange(application.id, 'accepted')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white hover:bg-zinc-800 transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Пригласить
                  </button>
                )}
                {application.status === 'new' && (
                  <button 
                    onClick={() => onStatusChange(application.id, 'review')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white hover:bg-blue-700 transition-all text-xs font-bold uppercase tracking-wider"
                  >
                    <Clock className="w-4 h-4" />
                    На рассмотрение
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
