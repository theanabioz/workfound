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
  Button,
  SimpleGrid,
  Avatar,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
} from '@chakra-ui/react'
import { User, Phone, Mail, ArrowLeft, FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IconButton } from '@chakra-ui/react'

export default async function EmployerApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id: vacancyId } = await params

  // 1. Проверяем, что вакансия принадлежит этому работодателю
  const { data: { user } } = await supabase.auth.getUser()
  const { data: vacancy, error: vError } = await supabase
    .from('vacancies')
    .select('title')
    .eq('id', vacancyId)
    .eq('employer_id', user?.id)
    .single()

  if (vError || !vacancy) {
    return notFound()
  }

  // 2. Получаем все отклики на эту вакансию
  const { data: applications, error: aError } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      worker_id,
      worker_profiles (
        first_name,
        last_name,
        phone,
        profession,
        experience_years,
        bio
      )
    `)
    .eq('vacancy_id', vacancyId)
    .order('created_at', { ascending: false })

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <HStack spacing={4}>
          <IconButton
            as={Link}
            href="/dashboard/employer/vacancies"
            aria-label="Назад"
            icon={<Icon as={ArrowLeft} />}
            variant="ghost"
          />
          <Box>
            <Heading size="lg">Отклики на вакансию</Heading>
            <Text color="blue.600" fontWeight="bold">«{vacancy.title}»</Text>
          </Box>
        </HStack>

        <Divider />

        {applications && applications.length > 0 ? (
          <TableContainer bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100" shadow="sm">
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Кандидат</Th>
                  <Th>Профессия / Опыт</Th>
                  <Th>Дата отклика</Th>
                  <Th>Статус</Th>
                  <Th>Действие</Th>
                </Tr>
              </Thead>
              <Tbody>
                {applications.map((app: any) => (
                  <Tr key={app.id}>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar name={`${app.worker_profiles.first_name} ${app.worker_profiles.last_name}`} size="sm" />
                        <Box>
                          <Text fontWeight="bold">
                            {app.worker_profiles.first_name} {app.worker_profiles.last_name}
                          </Text>
                          <HStack fontSize="xs" color="gray.500">
                            <Icon as={Phone} size={12} />
                            <Text>{app.worker_profiles.phone || 'Нет номера'}</Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm" fontWeight="medium">{app.worker_profiles.profession || 'Не указано'}</Text>
                      <Text fontSize="xs" color="gray.500">Опыт: {app.worker_profiles.experience_years} лет</Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm">{new Date(app.created_at).toLocaleDateString('ru-RU')}</Text>
                    </Td>
                    <Td>
                      <StatusBadge status={app.status} />
                    </Td>
                    <Td>
                      <StatusSelector applicationId={app.id} currentStatus={app.status} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          <Box textAlign="center" py={20} bg="gray.50" borderRadius="xl" border="1px dashed" borderColor="gray.300">
            <Icon as={Clock} boxSize={12} color="gray.400" mb={4} />
            <Text color="gray.500" fontSize="lg">Пока никто не откликнулся на эту вакансию.</Text>
          </Box>
        )}
      </Stack>
    </Container>
  )
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { color: string; label: string; icon: any }> = {
    PENDING: { color: 'yellow', label: 'Ожидание', icon: Clock },
    REVIEWING: { color: 'blue', label: 'Рассмотрение', icon: FileText },
    INTERVIEW: { color: 'purple', label: 'Интервью', icon: User },
    OFFER: { color: 'green', label: 'Оффер', icon: CheckCircle },
    REJECTED: { color: 'red', label: 'Отказ', icon: XCircle },
  }

  const config = configs[status] || configs.PENDING
  return (
    <Badge colorScheme={config.color} p={1} borderRadius="md" display="flex" alignItems="center" w="fit-content">
      <Icon as={config.icon} mr={1} size={14} />
      {config.label}
    </Badge>
  )
}

// Клиентский компонент для смены статуса (создадим ниже)
import StatusSelector from '@/components/dashboard/employer/StatusSelector'
