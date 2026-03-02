'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  Textarea,
  SimpleGrid,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Briefcase, MapPin, DollarSign, ListChecks, Phone } from 'lucide-react'
import Link from 'next/link'

export default function CreateVacancyPage() {
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary_min: 0,
    salary_max: 0,
    currency: 'EUR',
    location_country: '',
    location_city: '',
    job_type: 'FULL_TIME',
    contact_method: 'APPLICATIONS',
    contact_phone: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('vacancies')
      .insert([
        {
          ...formData,
          employer_id: user.id,
          salary_min: formData.salary_min || null,
          salary_max: formData.salary_max || null,
        },
      ])

    if (error) {
      toast({
        title: 'Ошибка публикации',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Вакансия опубликована!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      router.push('/dashboard/vacancies')
    }
    setLoading(false)
  }

  return (
    <Container maxW="4xl" py={10}>
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
            <Heading size="lg">Опубликовать вакансию</Heading>
            <Text color="gray.500">Найдите лучших специалистов прямо сейчас</Text>
          </Box>
        </HStack>

        <Divider />

        <form onSubmit={handleSubmit}>
          <Stack spacing={8}>
            {/* Основное */}
            <Box>
              <HStack mb={4}>
                <Icon as={Briefcase} color="blue.500" />
                <Heading size="md">Основная информация</Heading>
              </HStack>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Название вакансии</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Например: Сварщик на завод металлоконструкций"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Описание вакансии</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Опишите задачи, условия работы и график..."
                    rows={6}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Требования (через запятую или списком)</FormLabel>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Например: Опыт от 3 лет, Наличие сертификата..."
                    rows={3}
                  />
                </FormControl>
              </Stack>
            </Box>

            <Divider />

            {/* Зарплата и условия */}
            <Box>
              <HStack mb={4}>
                <Icon as={DollarSign} color="blue.500" />
                <Heading size="md">Зарплата и тип занятости</Heading>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <FormControl>
                  <FormLabel>Зарплата от</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.salary_min}
                    onChange={(_, val) => setFormData({ ...formData, salary_min: val })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>Зарплата до</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.salary_max}
                    onChange={(_, val) => setFormData({ ...formData, salary_max: val })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Валюта / Период</FormLabel>
                  <Select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option value="EUR">EUR / Месяц</option>
                    <option value="USD">USD / Месяц</option>
                    <option value="PLN">PLN / Месяц</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl mt={4} isRequired>
                <FormLabel>Тип занятости</FormLabel>
                <Select
                  value={formData.job_type}
                  onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                >
                  <option value="FULL_TIME">Полный рабочий день</option>
                  <option value="PART_TIME">Частичная занятость</option>
                  <option value="CONTRACT">Контракт / Проект</option>
                  <option value="TEMPORARY">Временная работа</option>
                </Select>
              </FormControl>
            </Box>

            <Divider />

            {/* Локация */}
            <Box>
              <HStack mb={4}>
                <Icon as={MapPin} color="blue.500" />
                <Heading size="md">Местоположение</Heading>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Страна</FormLabel>
                  <Input
                    value={formData.location_country}
                    onChange={(e) => setFormData({ ...formData, location_country: e.target.value })}
                    placeholder="Например: Германия"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Город</FormLabel>
                  <Input
                    value={formData.location_city}
                    onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                    placeholder="Например: Берлин"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Контакты */}
            <Box>
              <HStack mb={4}>
                <Icon as={Phone} color="blue.500" />
                <Heading size="md">Способ связи</Heading>
              </HStack>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Как соискатели должны связаться с вами?</FormLabel>
                  <Select
                    value={formData.contact_method}
                    onChange={(e) => setFormData({ ...formData, contact_method: e.target.value })}
                  >
                    <option value="APPLICATIONS">Только отклики на сайте</option>
                    <option value="PHONE">Только по номеру телефона</option>
                    <option value="BOTH">Отклики и звонки</option>
                  </Select>
                </FormControl>

                {(formData.contact_method === 'PHONE' || formData.contact_method === 'BOTH') && (
                  <FormControl isRequired>
                    <FormLabel>Номер телефона для связи</FormLabel>
                    <Input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      placeholder="+49 123 456 789"
                    />
                  </FormControl>
                )}
              </Stack>
            </Box>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={loading}
              loadingText="Публикация..."
              w="full"
            >
              Опубликовать вакансию
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
}

// Вспомогательный компонент для кнопки назад
import { IconButton } from '@chakra-ui/react'
