import { createClient } from '@/utils/supabase/server'
import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Divider,
  HStack,
  Icon,
  Badge,
  Card,
  CardBody,
  SimpleGrid,
  Avatar,
  Button,
} from '@chakra-ui/react'
import { ArrowLeft, Building2, MapPin, Calendar, Briefcase, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IconButton } from '@chakra-ui/react'
import ChatWindow from '@/components/chat/ChatWindow'

export default async function WorkerApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id: applicationId } = await params

  // 1. Получаем текущего пользователя (Соискателя)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return notFound()

  // 2. Получаем данные об отклике и вакансии
  const { data: application, error } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      worker_id,
      vacancies (
        id,
        title,
        description,
        location_country,
        location_city,
        salary_min,
        salary_max,
        currency,
        employer_profiles (
          company_name,
          description
        )
      )
    `)
    .eq('id', applicationId)
    .single()

  // Проверяем, что отклик существует и принадлежит этому соискателю
  if (error || !application || application.worker_id !== user.id) {
    return notFound()
  }

  const vacancy = application.vacancies

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <HStack spacing={4}>
          <IconButton
            as={Link}
            href="/dashboard/worker/applications"
            aria-label="Назад"
            icon={<Icon as={ArrowLeft} />}
            variant="ghost"
          />
          <Box>
            <Heading size="lg">Ваш отклик на вакансию</Heading>
            <Text color="blue.600" fontWeight="bold">«{vacancy.title}»</Text>
          </Box>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {/* Левая колонка: Информация о вакансии */}
          <Box gridColumn={{ md: 'span 1' }}>
            <Card variant="outline">
              <CardBody>
                <Stack spacing={6}>
                  <Box>
                    <HStack mb={2}>
                      <Icon as={Building2} color="gray.400" size={16} />
                      <Text fontSize="sm" fontWeight="bold" color="gray.600">
                        {vacancy.employer_profiles.company_name}
                      </Text>
                    </HStack>
                    <Heading size="md">{vacancy.title}</Heading>
                  </Box>

                  <Divider />

                  <Stack spacing={3} fontSize="sm">
                    <HStack>
                      <Icon as={MapPin} color="gray.400" size={16} />
                      <Text>{vacancy.location_country}, {vacancy.location_city}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={DollarSign} color="green.500" size={16} />
                      <Text fontWeight="bold">
                        {vacancy.salary_min && `от ${vacancy.salary_min}`}
                        {vacancy.salary_max && ` до ${vacancy.salary_max}`} {vacancy.currency}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={Calendar} color="gray.400" size={16} />
                      <Text>Дата отклика: {new Date(application.created_at).toLocaleDateString('ru-RU')}</Text>
                    </HStack>
                  </Stack>

                  <Box>
                    <Text fontWeight="bold" fontSize="xs" color="gray.400" textTransform="uppercase" mb={2}>
                      Статус отклика
                    </Text>
                    <StatusBadge status={application.status} />
                  </Box>

                  <Divider />
                  
                  <Button as={Link} href={`/vacancies/${vacancy.id}`} size="sm" variant="link">
                    Открыть страницу вакансии
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          </Box>

          {/* Правая колонка: Чат */}
          <Box gridColumn={{ md: 'span 2' }}>
            <Stack spacing={4}>
              <Box p={4} bg="blue.50" borderRadius="xl">
                <Heading size="sm" mb={1}>Чат с работодателем</Heading>
                <Text fontSize="xs" color="blue.700">
                  Здесь вы можете общаться с представителем компании. Сообщения приходят мгновенно.
                </Text>
              </Box>
              <ChatWindow applicationId={application.id} currentUserId={user.id} />
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; label: string }> = {
    PENDING: { color: 'yellow', label: 'Ожидание' },
    REVIEWING: { color: 'blue', label: 'Рассмотрение' },
    INTERVIEW: { color: 'purple', label: 'Интервью' },
    OFFER: { color: 'green', label: 'Оффер' },
    REJECTED: { color: 'red', label: 'Отказ' },
  }
  const config = configs[status] || configs.PENDING
  return <Badge colorScheme={config.color} p={1} borderRadius="md" w="fit-content">{config.label}</Badge>
}
