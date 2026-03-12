import Header from '@/components/layout/Header';
import { MapPin, Banknote, Clock, Building2, CheckCircle2, Phone, MessageCircle, ShieldCheck, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function JobDetailsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Вернуться к списку
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content - Job Details */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl border border-slate-200/75 p-6 md:p-10 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Водитель-дальнобойщик категории CE</h1>
                  <div className="text-xl text-slate-600 mb-6 font-medium">TransLogistics GmbH</div>
                  
                  <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      Германия, Мюнхен
                    </div>
                    <div className="flex items-center gap-2 font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg text-base">
                      <Banknote className="w-5 h-5 text-emerald-600" />
                      €2,500 - €3,000 на руки
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-slate-400" />
                      Полная занятость
                    </div>
                  </div>
                </div>
                
                <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 w-full text-center">
                    Откликнуться
                  </button>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 w-full flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Написать в WhatsApp
                  </button>
                  <button className="bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 px-8 py-3.5 rounded-xl font-semibold transition-all w-full flex items-center justify-center gap-2">
                    <Phone className="w-5 h-5" />
                    Показать телефон
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-10 pb-10 border-b border-slate-100">
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">Жилье предоставляется</span>
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">Официальное трудоустройство</span>
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">Русскоязычный диспетчер</span>
              </div>

              <div className="space-y-10">
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-5 tracking-tight">Описание вакансии</h2>
                  <div className="text-slate-700 space-y-4 leading-relaxed text-lg">
                    <p>
                      Немецкая транспортная компания TransLogistics GmbH приглашает на работу водителей-дальнобойщиков категории CE для работы по Европе (Германия, Франция, Бенилюкс).
                    </p>
                    <p>
                      Мы предлагаем стабильную работу в надежной компании с современным автопарком (Mercedes Actros, MAN TGX не старше 3 лет). Тенты и рефрижераторы.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-5 tracking-tight">Требования</h2>
                  <ul className="space-y-3">
                    {[
                      'Наличие водительского удостоверения категории CE',
                      'Опыт работы по Европе от 1 года',
                      'Наличие чип-карты тахографа',
                      'Код 95 (помогаем с оформлением)',
                      'Базовое понимание немецкого или английского (приветствуется, но не обязательно - есть русскоязычные диспетчеры)',
                      'Ответственность, отсутствие вредных привычек'
                    ].map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 text-lg">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-5 tracking-tight">Условия работы</h2>
                  <ul className="space-y-3">
                    {[
                      'Официальное трудоустройство по немецкому контракту',
                      'Зарплата от €2,500 до €3,000 нетто (на руки)',
                      'Своевременные выплаты 2 раза в месяц',
                      'График работы: 4/1, 6/2, 8/2 (обсуждается индивидуально)',
                      'Бесплатное комфортное жилье на базе (душ, кухня, стиральная машина, Wi-Fi)',
                      'Оплачиваемый отпуск 24 дня в году',
                      'Медицинская страховка'
                    ].map((cond, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700 text-lg">
                        <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Company Info */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl border border-slate-200/75 p-6 sticky top-24 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6 text-lg tracking-tight">О компании</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                  <Building2 className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">TransLogistics GmbH</div>
                  <div className="text-sm text-slate-500 font-medium">На сайте с 2022 года</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl text-sm font-semibold mb-6">
                <ShieldCheck className="w-5 h-5" />
                Компания проверена
              </div>

              <div className="space-y-4 text-sm text-slate-600 mb-8">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Сфера:</span>
                  <span className="font-semibold text-slate-900">Логистика</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Штат:</span>
                  <span className="font-semibold text-slate-900">50-100 человек</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-slate-500">Локация:</span>
                  <span className="font-semibold text-slate-900">Германия</span>
                </div>
              </div>

              <Link href="/companies/1" className="block w-full text-center bg-slate-50 hover:bg-slate-100 text-blue-600 font-semibold py-3 rounded-xl transition-colors border border-slate-200">
                Все вакансии компании (12)
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
