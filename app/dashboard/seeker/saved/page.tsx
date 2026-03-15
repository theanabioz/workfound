import JobCard from '@/components/jobs/JobCard';

export default function SavedJobsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Сохраненные вакансии</h1>
          <p className="text-sm text-slate-500 mt-1">Вакансии, которые вы добавили в избранное</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <JobCard 
          id="1"
          title="Водитель-дальнобойщик категории CE"
          company="TransLogistics GmbH"
          location="Германия, Мюнхен"
          salary="€2,500 - €3,000"
          tags={['Жилье предоставляется', 'Официальное трудоустройство']}
          postedAt="2 часа назад"
          isPremium={true}
        />
        <JobCard 
          id="3"
          title="Сварщик MIG/MAG"
          company="MetalWorks s.r.o."
          location="Чехия, Прага"
          salary="€2,000 - €2,400"
          tags={['Бесплатное проживание', 'Спецодежда']}
          postedAt="1 день назад"
        />
        <JobCard 
          id="4"
          title="Монтажник солнечных панелей"
          company="EcoEnergy B.V."
          location="Нидерланды, Амстердам"
          salary="€2,200 - €2,800"
          tags={['Обучение', 'Транспорт до работы']}
          postedAt="1 день назад"
        />
      </div>
    </div>
  );
}
