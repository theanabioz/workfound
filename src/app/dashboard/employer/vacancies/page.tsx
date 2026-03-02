'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useToast,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  HStack,
  Icon,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { Plus, MoreVertical, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react'

export default function MyVacanciesPage() {
  const [vacancies, setVacancies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const toast = useToast()

  const fetchVacancies = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('vacancies')
      .select('*, applications(count)')
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        title: 'Ошибка загрузки',
        description: error.message,
        status: 'error',
      })
    } else {
      const formattedData = data?.map(v => ({
        ...v,
        applications_count: v.applications?.[0]?.count || 0
      }))
      setVacancies(formattedData || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVacancies()
  }, [])

  const toggleVacancyStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('vacancies')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (error) {
      toast({ title: 'Ошибка', description: error.message, status: 'error' })
    } else {
      toast({ title: 'Статус обновлен', status: 'success' })
      fetchVacancies()
    }
  }

  if (loading) return (
    <Container maxW="6xl" py={20} textAlign="center">
      <Text>Загрузка ваших вакансий...</Text>
    </Container>
  )

  return (
    <Container maxW="6xl" py={10}>
      <Stack spacing={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Heading size="lg">Мои вакансии</Heading>
            <Text color="gray.500">Управляйте вашими объявлениями и откликами</Text>
          </Box>
          <Button
            as={Link}
            href="/dashboard/employer/vacancies/create"
            leftIcon={<Icon as={Plus} />}
            colorScheme="blue"
          >
            Новая вакансия
          </Button>
        </Box>

        {vacancies.length === 0 ? (
          <Card variant="outline" textAlign="center" py={10}>
            <CardBody>
              <Stack align="center" spacing={4}>
                <Icon as={Briefcase} boxSize={12} color="gray.300" />
                <Text fontSize="lg" color="gray.600">
                  У вас пока нет опубликованных вакансий
                </Text>
                <Button as={Link} href="/dashboard/employer/vacancies/create" colorScheme="blue" variant="outline">
                  Создать первую вакансию
                </Button>
              </Stack>
            </CardBody>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {vacancies.map((vacancy) => (
              <Card key={vacancy.id} variant="outline" _hover={{ shadow: 'md' }} transition="all 0.2s">
                <CardHeader pb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Stack spacing={1}>
                      <Badge colorScheme={vacancy.is_active ? 'green' : 'gray'}>
                        {vacancy.is_active ? 'Активна' : 'Архив'}
                      </Badge>
                      <Heading size="md">{vacancy.title}</Heading>
                    </Stack>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<Icon as={MoreVertical} />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem onClick={() => toggleVacancyStatus(vacancy.id, vacancy.is_active)}>
                          {vacancy.is_active ? 'Архивировать' : 'Опубликовать'}
                        </MenuItem>
                        <MenuItem color="red.500">Удалить</MenuItem>
                      </MenuList>
                    </Menu>
                  </Box>
                </CardHeader>
                <CardBody pt={2}>
                  <Stack spacing={3} fontSize="sm" color="gray.600">
                    <HStack>
                      <Icon as={MapPin} size={16} />
                      <Text>{vacancy.location_country}, {vacancy.location_city}</Text>
                    </HStack>
                    <HStack>
                      <Icon as={DollarSign} size={16} />
                      <Text>
                        {vacancy.salary_min && `от ${vacancy.salary_min}`}
                        {vacancy.salary_max && ` до ${vacancy.salary_max}`} {vacancy.currency}
                      </Text>
                    </HStack>
                    <HStack>
                      <Icon as={Calendar} size={16} />
                      <Text>Создана: {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}</Text>
                    </HStack>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter display="flex" justifyContent="space-between">
                  <Button
                    as={Link}
                    href={`/dashboard/employer/vacancies/${vacancy.id}/applications`}
                    size="sm"
                    variant="ghost"
                    isDisabled={!vacancy.is_active && vacancy.applications_count === 0}
                  >
                    Отклики ({vacancy.applications_count})
                  </Button>
                  <Button size="sm" variant="link" colorScheme="blue">Редактировать</Button>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  )
}
