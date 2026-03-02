'use client'

import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Stack,
  Card,
  CardHeader,
  CardBody,
  Icon,
} from '@chakra-ui/react'
import { Plus, Users, LayoutList } from 'lucide-react'
import Link from 'next/link'

export function EmployerDashboard({ profile }: { profile: any }) {
  return (
    <Box p={8}>
      <Stack spacing={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Heading size="lg">Кабинет работодателя</Heading>
            <Text color="gray.500">Управление вакансиями компании</Text>
          </Box>
          <Button
            as={Link}
            href="/dashboard/employer/vacancies/create"
            leftIcon={<Icon as={Plus} />}
            colorScheme="blue"
          >
            Создать вакансию
          </Button>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <DashboardStat label="Активные вакансии" value="0" icon={LayoutList} />
          <DashboardStat label="Всего откликов" value="0" icon={Users} />
          <DashboardStat label="Новые кандидаты" value="0" icon={Plus} />
        </SimpleGrid>

        <Card variant="outline">
          <CardHeader>
            <Heading size="md">Ваши вакансии</Heading>
          </CardHeader>
          <CardBody>
            <Text color="gray.500">У вас пока нет активных вакансий. Опубликуйте свою первую вакансию!</Text>
            <Button
              as={Link}
              href="/dashboard/employer/vacancies/create"
              mt={4}
              colorScheme="blue"
              variant="outline"
              leftIcon={<Icon as={Plus} />}
            >
              Добавить вакансию
            </Button>
          </CardBody>
        </Card>
      </Stack>
    </Box>
  )
}

function DashboardStat({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <Stat
      px={4}
      py={5}
      shadow={'base'}
      border={'1px solid'}
      borderColor={'gray.200'}
      rounded={'lg'}
      bg="white"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <StatLabel fontWeight={'medium'} isTruncated>
            {label}
          </StatLabel>
          <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
            {value}
          </StatNumber>
        </Box>
        <Icon as={icon} boxSize={8} color="blue.500" />
      </Box>
    </Stat>
  )
}
