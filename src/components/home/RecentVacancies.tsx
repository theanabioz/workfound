'use client'

import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  Flex,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import VacancyList from '@/components/vacancies/VacancyList'
import VacancyFilters from '@/components/vacancies/filters/VacancyFilters'

interface RecentVacanciesProps {
  vacancies: any[]
}

export default function RecentVacancies({ vacancies }: RecentVacanciesProps) {
  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} py={12}>
      <Container maxW="7xl">
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} alignItems="start">
          {/* Сетка фильтров слева */}
          <Box gridColumn={{ md: 'span 1' }} position={{ md: 'sticky' }} top="100px">
            <Stack spacing={6}>
              <Box>
                <Heading size="md" mb={2}>Подбор вакансий</Heading>
                <Text fontSize="sm" color="gray.500">Настройте поиск под свои нужды</Text>
              </Box>
              <VacancyFilters />
            </Stack>
          </Box>

          {/* Список вакансий справа */}
          <Box gridColumn={{ md: 'span 3' }}>
            <Flex 
              justify="space-between" 
              align="center" 
              mb={6} 
              direction={{ base: 'column', md: 'row' }} 
              gap={4}
            >
              <Heading size="lg">Свежие вакансии</Heading>
              <Link href="/vacancies" passHref legacyBehavior>
                <Button 
                  variant="link" 
                  colorScheme="blue" 
                  rightIcon={<Icon as={ArrowRight} size={16} />}
                >
                  Смотреть все
                </Button>
              </Link>
            </Flex>

            <VacancyList vacancies={vacancies} />

            <Box textAlign="center" mt={10}>
              <Link href="/vacancies" passHref legacyBehavior>
                <Button 
                  size="lg" 
                  colorScheme="blue" 
                  px={10}
                  shadow="lg"
                  _hover={{ shadow: 'xl', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                >
                  Найти больше вакансий
                </Button>
              </Link>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  )
}
