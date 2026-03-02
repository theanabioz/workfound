import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/server'
import HomeHero from '@/components/home/HomeHero'
import RecentVacancies from '@/components/home/RecentVacancies'

export default async function HomePage() {
  const supabase = await createClient()

  // Получаем последние 5 вакансий для главной страницы
  const { data: vacancies } = await supabase
    .from('vacancies')
    .select('*, employer_profiles(company_name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <Box>
      {/* Клиентский компонент Hero */}
      <HomeHero />

      {/* Клиентский компонент со списком вакансий */}
      <RecentVacancies vacancies={vacancies || []} />

      {/* Преимущества (Серверная часть, без функций в пропсах) */}
      <Box bg="gray.50" py={16}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Stack>
              <Text fontWeight="bold" fontSize="lg">Работа без посредников</Text>
              <Text color="gray.600">Общайтесь напрямую с европейскими компаниями через встроенный чат или по телефону.</Text>
            </Stack>
            <Stack>
              <Text fontWeight="bold" fontSize="lg">Проверенные компании</Text>
              <Text color="gray.600">Мы модерируем каждое объявление, чтобы защитить вас от недобросовестных работодателей.</Text>
            </Stack>
            <Stack>
              <Text fontWeight="bold" fontSize="lg">Удобно с телефона</Text>
              <Text color="gray.600">Находите работу и откликайтесь в один клик прямо со своего смартфона.</Text>
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  )
}
