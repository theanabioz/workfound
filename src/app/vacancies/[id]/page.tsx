import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import VacancyDetails from '@/components/vacancies/VacancyDetails'

export default async function VacancyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  // Получаем детальную информацию о вакансии и компании на сервере
  const { data: vacancy, error } = await supabase
    .from('vacancies')
    .select('*, employer_profiles(*)')
    .eq('id', id)
    .single()

  if (error || !vacancy) {
    return notFound()
  }

  // Передаем чистые данные в клиентский компонент
  return <VacancyDetails vacancy={vacancy} />
}
