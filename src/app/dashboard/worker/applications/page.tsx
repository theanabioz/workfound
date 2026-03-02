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
} from '@chakra-ui/react'
import { ArrowLeft, Briefcase, MapPin, Clock, FileText, CheckCircle, XCircle, Search, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { IconButton } from '@chakra-ui/react'

export default async function WorkerApplicationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Получаем все отклики этого соискателя
  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      vacancies (
        id,
        title,
        location_country,
        location_city,
        employer_profiles (
          company_name
        )
      )
    `)
    .eq('worker_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <HStack spacing={4}>
          <IconButton
            as={Link}
            href="/dashboard"
            aria-label="Назад"
            icon={<Icon as={ArrowLeft} />}
            variant="ghost"
          />
          <Box>
            <Heading size="lg">Мои отклики</Heading>
            <Text color="gray.500">История ваших заявок на вакансии</Text>
          </Box>
        </HStack>

        <Divider />

        {applications && applications.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {applications.map((app: any) => (
              <Card key={app.id} variant="outline" _hover={{ shadow: 'sm' }} transition="all 0.2s">
                <CardBody>
                  <Stack spacing={4}>
                    <Box display="flex" justifyContent="space-between" alignItems="start">
                      <Stack spacing={1}>
                        <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase">
                          {app.vacancies.employer_profiles.company_name}
                        </Text>
                        <Heading size="md">
                          <Link href={`/vacancies/${app.vacancies.id}`} style={{ color: 'inherit' }}>
                            {app.vacancies.title}
                          </Link>
                        </Heading>
                      </Stack>
                      <StatusBadge status={app.status} />
                    </Box>

                    <HStack spacing={4} fontSize="sm" color="gray.600">
                      <HStack>
                        <Icon as={MapPin} size={14} />
                        <Text>{app.vacancies.location_country}, {app.vacancies.location_city}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={Clock} size={14} />
                        <Text>Отклик: {new Date(app.created_at).toLocaleDateString('ru-RU')}</Text>
                      </HStack>
                    </HStack>

                    <Divider />
                    
                    <HStack spacing={4}>
                      <Button
                        as={Link}
                        href={`/dashboard/worker/applications/${app.id}`}
                        variant="solid"
                        colorScheme="blue"
                        size="sm"
                        leftIcon={<Icon as={MessageSquare} size={14} />}
                        flex={1}
                      >
                        Чат
                      </Button>
                      <Button
                        as={Link}
                        href={`/vacancies/${app.vacancies.id}`}
                        variant="ghost"
                        colorScheme="gray"
                        size="sm"
                        leftIcon={<Icon as={Search} size={14} />}
                      >
                        Вакансия
                      </Button>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={20} bg="gray.50" borderRadius="xl" border="1px dashed" borderColor="gray.300">
            <Icon as={Briefcase} boxSize={12} color="gray.400" mb={4} />
            <Text color="gray.500" fontSize="lg" mb={4}>Вы еще не откликались на вакансии.</Text>
            <Button as={Link} href="/vacancies" colorScheme="blue">Найти работу</Button>
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
    <Badge colorScheme={config.color} p={1} borderRadius="md" display="flex" alignItems="center" w="fit-content" fontSize="xs">
      <Icon as={config.icon} mr={1} size={12} />
      {config.label}
    </Badge>
  )
}
