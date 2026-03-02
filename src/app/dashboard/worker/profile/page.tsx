'use client'

import { useEffect, useState } from 'react'
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
} from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import FileUpload from '@/components/ui/FileUpload'

export default function WorkerProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const toast = useToast()
  const router = useRouter()
  const supabase = createClient()

  // Форма для управления состоянием
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    profession: '',
    experience_years: 0,
    skills: '',
    bio: '',
    location_country: '',
    location_city: '',
    resume_url: '',
  })

  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)

      const { data, error } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          profession: data.profession || '',
          experience_years: data.experience_years || 0,
          skills: data.skills?.join(', ') || '',
          bio: data.bio || '',
          location_country: data.location_country || '',
          location_city: data.location_city || '',
          resume_url: data.resume_url || '',
        })
      }
      setLoading(false)
    }

    fetchProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Превращаем строку навыков в массив
    const skillsArray = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')

    const { error } = await supabase
      .from('worker_profiles')
      .update({
        ...formData,
        skills: skillsArray,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      toast({
        title: 'Ошибка сохранения',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Профиль обновлен',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
    setSaving(false)
  }

  if (loading) return (
    <Container maxW="3xl" py={20} textAlign="center">
      <Text>Загрузка профиля...</Text>
    </Container>
  )

  return (
    <Container maxW="3xl" py={10}>
      <Stack spacing={6}>
        <Box>
          <Heading size="lg">Ваш профиль</Heading>
          <Text color="gray.500">Заполните данные о себе, чтобы работодатели могли вас найти</Text>
        </Box>

        <Divider />

        <form onSubmit={handleSave}>
          <Stack spacing={8}>
            <FileUpload
              userId={userId}
              bucket="resumes"
              currentUrl={formData.resume_url}
              accept=".pdf"
              onUploadComplete={(url) => setFormData({ ...formData, resume_url: url })}
            />

            {/* Секция: Основная информация */}
            <Box>
              <Heading size="md" mb={4}>Основная информация</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Имя</FormLabel>
                  <Input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Иван"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Фамилия</FormLabel>
                  <Input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Иванов"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Телефон</FormLabel>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 999 123 45 67"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Секция: Профессиональные данные */}
            <Box>
              <Heading size="md" mb={4}>Профессиональные данные</Heading>
              <Stack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Профессия / Специальность</FormLabel>
                  <Input
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    placeholder="Например: Сварщик, Водитель категории C"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Опыт работы (лет)</FormLabel>
                  <NumberInput
                    min={0}
                    max={50}
                    value={formData.experience_years}
                    onChange={(_, val) => setFormData({ ...formData, experience_years: val })}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Навыки (через запятую)</FormLabel>
                  <Input
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="Аргонная сварка, Чтение чертежей, Вождение погрузчика"
                  />
                </FormControl>
              </Stack>
            </Box>

            <Divider />

            {/* Секция: Местоположение */}
            <Box>
              <Heading size="md" mb={4}>Где вы находитесь</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>Страна</FormLabel>
                  <Input
                    value={formData.location_country}
                    onChange={(e) => setFormData({ ...formData, location_country: e.target.value })}
                    placeholder="Польша"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Город</FormLabel>
                  <Input
                    value={formData.location_city}
                    onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                    placeholder="Варшава"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Секция: О себе */}
            <Box>
              <Heading size="md" mb={4}>О себе</Heading>
              <FormControl>
                <FormLabel>Краткая биография / Доп. информация</FormLabel>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Расскажите о своем опыте и сильных сторонах..."
                  rows={5}
                />
              </FormControl>
            </Box>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={saving}
              loadingText="Сохранение..."
            >
              Сохранить профиль
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
}
