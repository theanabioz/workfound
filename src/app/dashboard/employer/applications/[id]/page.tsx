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
import { ArrowLeft, User, Phone, Briefcase, Calendar, FileDown } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IconButton } from '@chakra-ui/react'
import ChatWindow from '@/components/chat/ChatWindow'

export default async function EmployerApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id: applicationId } = await params

  // 1. Получаем текущего пользователя (Работодателя)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return notFound()

  // 2. Получаем данные об отклике и соискателе
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
        employer_id
      ),
      worker_profiles (
        first_name,
        last_name,
        phone,
        profession,
        experience_years,
        bio,
        resume_url
      )
    `)
    .eq('id', applicationId)
    .single()

  // Проверяем, что отклик существует и принадлежит вакансии этого работодателя
  if (error || !application || application.vacancies.employer_id !== user.id) {
    return notFound()
  }

  const worker = application.worker_profiles

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <HStack spacing={4}>
          <IconButton
            as={Link}
            href={`/dashboard/employer/vacancies/${application.vacancies.id}/applications`}
            aria-label="Назад"
            icon={<Icon as={ArrowLeft} />}
            variant="ghost"
          />
          <Box>
            <Heading size="lg">Кандидат: {worker.first_name} {worker.last_name}</Heading>
            <Text color="gray.500">Отклик на вакансию «{application.vacancies.title}»</Text>
          </Box>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {/* Левая колонка: Данные кандидата */}
          <Box gridColumn={{ md: 'span 1' }}>
            <Card variant="outline">
              <CardBody>
                <Stack spacing={6}>
                  <Box textAlign="center">
                    <Avatar size="2xl" name={`${worker.first_name} ${worker.last_name}`} mb={4} />
                    <Heading size="md">{worker.first_name} {worker.last_name}</Heading>
                    <Text color="blue.600" fontWeight="bold">{worker.profession}</Text>
                  </Box>

                  <Divider />

                  <Stack spacing={3} fontSize="sm">
                    <HStack>
                      <Icon as={Briefcase} color="gray.400" size={16} />
                      <Text>Опыт: {worker.experience_years} лет</Text>
                    </HStack>
                    <HStack>
                      <Icon as={Phone} color="gray.400" size={16} />
                      <Text>{worker.phone || 'Не указан'}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={Calendar} color="gray.400" size={16} />
                      <Text>Дата отклика: {new Date(application.created_at).toLocaleDateString('ru-RU')}</Text>
                    </HStack>
                  </Stack>

                  {worker.resume_url && (
                    <Button
                      as="a"
                      href={worker.resume_url}
                      target="_blank"
                      leftIcon={<Icon as={FileDown} />}
                      colorScheme="blue"
                      variant="outline"
                      size="sm"
                      w="full"
                    >
                      Скачать резюме
                    </Button>
                  )}

                  <Box>
                    <Text fontWeight="bold" fontSize="xs" color="gray.400" textTransform="uppercase" mb={2}>
                      О себе
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      {worker.bio || 'Кандидат не оставил дополнительной информации.'}
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Box>

          {/* Правая колонка: Чат */}
          <Box gridColumn={{ md: 'span 2' }}>
            <Stack spacing={4}>
              <Box p={4} bg="gray.50" borderRadius="xl">
                <Heading size="sm" mb={1}>Чат с соискателем</Heading>
                <Text fontSize="xs" color="gray.500">
                  Вы можете задать уточняющие вопросы или договориться об интервью.
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
