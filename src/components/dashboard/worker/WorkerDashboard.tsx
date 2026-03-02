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
import { Briefcase, ClipboardList, User } from 'lucide-react'

export function WorkerDashboard({ profile }: { profile: any }) {
  return (
    <Box p={8}>
      <Stack spacing={8}>
        <Box>
          <Heading size="lg">Личный кабинет соискателя</Heading>
          <Text color="gray.500">Добро пожаловать, {profile.email}</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <DashboardStat label="Мои отклики" value="0" icon={ClipboardList} />
          <DashboardStat label="Активные вакансии" value="12" icon={Briefcase} />
          <DashboardStat label="Просмотры профиля" value="5" icon={User} />
        </SimpleGrid>

        <Card variant="outline">
          <CardHeader>
            <Heading size="md">Ваши последние отклики</Heading>
          </CardHeader>
          <CardBody>
            <Text color="gray.500">У вас пока нет активных откликов. Начните поиск прямо сейчас!</Text>
            <Button mt={4} colorScheme="blue">Найти работу</Button>
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
