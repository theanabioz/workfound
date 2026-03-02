import { createClient } from '@/utils/supabase/server'
import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  Divider,
  HStack,
  Icon,
  Badge,
  Card,
  CardBody,
  Button,
} from '@chakra-ui/react'
import { MapPin, Briefcase, DollarSign, Search } from 'lucide-react'
import Link from 'next/link'
import VacancyFilters from '@/components/vacancies/filters/VacancyFilters'

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

  // Получаем все активные вакансии с фильтрами
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

          {/* Список вакансий */}
          <Box gridColumn={{ md: 'span 3' }}>
            <Stack spacing={4}>
              {vacancies?.map((vacancy) => (
                <Card
                  key={vacancy.id}
                  variant="outline"
                  _hover={{ shadow: 'md', borderColor: 'blue.200' }}
                  transition="all 0.2s"
                >
                  <CardBody>
                    <Stack spacing={4}>
                      <Box display="flex" justifyContent="space-between" alignItems="start">
                        <Stack spacing={1}>
                          <Text fontWeight="bold" color="blue.600" fontSize="sm">
                            {vacancy.employer_profiles?.company_name || 'Название компании'}
                          </Text>
                          <Heading size="md">{vacancy.title}</Heading>
                        </Stack>
                        <Badge colorScheme="blue">
                          {vacancy.job_type === 'FULL_TIME' ? 'Полный рабочий день' : 'Проект'}
                        </Badge>
                      </Box>

                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} fontSize="sm" color="gray.600">
                        <HStack>
                          <Icon as={MapPin} size={16} />
                          <Text>{vacancy.location_country}, {vacancy.location_city}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={DollarSign} size={16} />
                          <Text fontWeight="bold" color="green.600">
                            {vacancy.salary_min && `от ${vacancy.salary_min}`}
                            {vacancy.salary_max && ` до ${vacancy.salary_max}`} {vacancy.currency}
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={Briefcase} size={16} />
                          <Text>{vacancy.job_type === 'FULL_TIME' ? 'Постоянная' : 'Временная'}</Text>
                        </HStack>
                      </SimpleGrid>

                      <Box noOfLines={2} fontSize="sm" color="gray.500">
                        {vacancy.description}
                      </Box>

                      <Divider />

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Text fontSize="xs" color="gray.400">
                          Опубликовано: {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
                        </Text>
                        <Button as={Link} href={`/vacancies/${vacancy.id}`} colorScheme="blue" size="sm">
                          Подробнее
                        </Button>
                      </Box>
                    </Stack>
                  </CardBody>
                </Card>
              ))}

              {vacancies?.length === 0 && (
                <Box textAlign="center" py={20}>
                  <Text color="gray.500">Вакансий по вашему запросу не найдено.</Text>
                </Box>
              )}
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
