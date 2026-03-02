import { createClient } from '@/utils/supabase/server'
import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react'
import VacancyFilters from '@/components/vacancies/filters/VacancyFilters'
import VacancyList from '@/components/vacancies/VacancyList'

export default async function VacanciesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const queryTerm = params.q as string
  const countryParam = params.country as string
  const typeParam = params.type as string

  // Получаем все активные вакансии с фильтрами (Server Side)
  let query = supabase
    .from('vacancies')
    .select('*, employer_profiles(company_name)')
    .eq('is_active', true)

  if (queryTerm) {
    query = query.ilike('title', `%${queryTerm}%`)
  }
  
  if (countryParam) {
    query = query.eq('location_country', countryParam)
  }

  if (typeParam) {
    query = query.eq('job_type', typeParam)
  }

  const { data: vacancies, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vacancies:', error)
    return <div>Ошибка загрузки вакансий. Пожалуйста, попробуйте позже.</div>
  }

  return (
    <Container maxW="7xl" py={10}>
      <Stack spacing={8}>
        <Box>
          <Heading size="lg">Поиск работы в Европе</Heading>
          <Text color="gray.500">Найдено {vacancies?.length || 0} актуальных вакансий</Text>
        </Box>

        <Divider />

        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8} alignItems="start">
          {/* Боковая панель фильтров */}
          <Box position={{ md: 'sticky' }} top="100px">
            <VacancyFilters />
          </Box>

          {/* Список вакансий (Client Component) */}
          <Box gridColumn={{ md: 'span 3' }}>
            <VacancyList vacancies={vacancies || []} />
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
