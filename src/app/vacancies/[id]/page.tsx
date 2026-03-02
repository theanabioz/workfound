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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import { MapPin, Briefcase, DollarSign, Calendar, ChevronRight, Building2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ApplyButton from '@/components/vacancies/ApplyButton'
import PhoneButton from '@/components/vacancies/PhoneButton'

export default async function VacancyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  // Получаем детальную информацию о вакансии и компании
  const { data: vacancy, error } = await supabase
    .from('vacancies')
    .select('*, employer_profiles(*)')
    .eq('id', id)
    .single()

  if (error || !vacancy) {
    return notFound()
  }

  return (
    <Container maxW="5xl" py={10}>
      <Stack spacing={8}>
        {/* Хлебные крошки */}
        <Breadcrumb spacing="8px" separator={<ChevronRight size={16} color="gray" />}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/vacancies">Вакансии</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text color="gray.500">{vacancy.title}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {/* Основная часть */}
          <Box gridColumn={{ md: 'span 2' }}>
            <Stack spacing={6}>
              <Box>
                <Badge colorScheme="blue" mb={2}>
                  {vacancy.job_type === 'FULL_TIME' ? 'Полный рабочий день' : 'Проект'}
                </Badge>
                <Heading size="xl" mb={4}>{vacancy.title}</Heading>
                
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} color="gray.600">
                  <HStack>
                    <Icon as={MapPin} color="blue.500" />
                    <Text fontSize="lg">{vacancy.location_country}, {vacancy.location_city}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={DollarSign} color="green.500" />
                    <Text fontSize="lg" fontWeight="bold">
                      {vacancy.salary_min && `от ${vacancy.salary_min}`}
                      {vacancy.salary_max && ` до ${vacancy.salary_max}`} {vacancy.currency}
                    </Text>
                  </HStack>
                </SimpleGrid>
              </Box>

              <Divider />

              <Box>
                <Heading size="md" mb={4}>Описание вакансии</Heading>
                <Text whiteSpace="pre-wrap" color="gray.700">
                  {vacancy.description}
                </Text>
              </Box>

              {vacancy.requirements && (
                <Box>
                  <Heading size="md" mb={4}>Требования</Heading>
                  <Text whiteSpace="pre-wrap" color="gray.700">
                    {vacancy.requirements}
                  </Text>
                </Box>
              )}

              <Box p={6} bg="blue.50" borderRadius="xl">
                <Stack spacing={4} align="center" textAlign="center">
                  <Heading size="sm">
                    {vacancy.contact_method === 'PHONE' 
                      ? 'Свяжитесь с работодателем' 
                      : 'Готовы откликнуться?'}
                  </Heading>
                  <Text fontSize="sm">
                    {vacancy.contact_method === 'PHONE' 
                      ? 'Позвоните по номеру ниже, чтобы обсудить вакансию.' 
                      : 'Ваше резюме и контактные данные будут отправлены работодателю.'}
                  </Text>
                  
                  {(vacancy.contact_method === 'APPLICATIONS' || vacancy.contact_method === 'BOTH') && (
                    <ApplyButton vacancyId={vacancy.id} />
                  )}

                  {(vacancy.contact_method === 'PHONE' || vacancy.contact_method === 'BOTH') && (
                    <>
                      {vacancy.contact_method === 'BOTH' && <Text fontSize="xs" fontWeight="bold" color="gray.400">ИЛИ</Text>}
                      <PhoneButton phoneNumber={vacancy.contact_phone || ''} />
                    </>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Боковая часть (Информация о компании) */}
          <Box>
            <Stack spacing={6}>
              <Card variant="outline">
                <CardBody>
                  <Stack spacing={4}>
                    <HStack>
                      <Icon as={Building2} boxSize={6} color="blue.500" />
                      <Heading size="sm">О компании</Heading>
                    </HStack>
                    <Text fontWeight="bold" fontSize="lg">
                      {vacancy.employer_profiles?.company_name || 'Название компании'}
                    </Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={4}>
                      {vacancy.employer_profiles?.description || 'Нет описания компании.'}
                    </Text>
                    <Divider />
                    <Button variant="link" colorScheme="blue" size="sm" justifyContent="start">
                      Все вакансии компании
                    </Button>
                  </Stack>
                </CardBody>
              </Card>

              <Card variant="outline" bg="gray.50">
                <CardBody>
                  <Stack spacing={3} fontSize="sm">
                    <HStack justify="space-between">
                      <Text color="gray.500">Опубликовано:</Text>
                      <Text>{new Date(vacancy.created_at).toLocaleDateString('ru-RU')}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.500">ID вакансии:</Text>
                      <Text color="xs">{vacancy.id.slice(0, 8)}</Text>
                    </HStack>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  )
}
