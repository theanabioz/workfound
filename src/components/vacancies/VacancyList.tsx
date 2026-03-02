'use client'

import {
  Box,
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
import { MapPin, Briefcase, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface VacancyListProps {
  vacancies: any[]
}

export default function VacancyList({ vacancies }: VacancyListProps) {
  return (
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
  )
}

// Добавляем импорт Heading, который забыли
import { Heading } from '@chakra-ui/react'
