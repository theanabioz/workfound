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
  Divider,
  Badge,
  Flex,
} from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Building2, Globe, Info, CheckCircle2, AlertCircle } from 'lucide-react'
import FileUpload from '@/components/ui/FileUpload'

export default function EmployerProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [userId, setUserId] = useState<string>('')
  const toast = useToast()
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    company_name: '',
    description: '',
    website: '',
    industry: '',
    logo_url: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUserId(user.id)
...
      if (data) {
        setProfile(data)
        setFormData({
          company_name: data.company_name || '',
          description: data.description || '',
          website: data.website || '',
          industry: data.industry || '',
          logo_url: data.logo_url || '',
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

    const { error } = await supabase
      .from('employer_profiles')
      .update({
        ...formData,
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
        title: 'Профиль компании обновлен',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
    setSaving(false)
  }

  if (loading) return (
    <Container maxW="3xl" py={20} textAlign="center">
      <Text>Загрузка данных компании...</Text>
    </Container>
  )

  return (
    <Container maxW="3xl" py={10}>
      <Stack spacing={8}>
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg">Профиль компании</Heading>
            <Text color="gray.500">Информация о вашем бренде для соискателей</Text>
          </Box>
          <Box>
            {profile?.is_verified ? (
              <Badge colorScheme="green" p={2} borderRadius="full" display="flex" alignItems="center">
                <CheckCircle2 size={16} style={{ marginRight: '4px' }} /> Проверен
              </Badge>
            ) : (
              <Badge colorScheme="yellow" p={2} borderRadius="full" display="flex" alignItems="center">
                <AlertCircle size={16} style={{ marginRight: '4px' }} /> Ожидает проверки
              </Badge>
            )}
          </Box>
        </Flex>

        <Divider />

        <form onSubmit={handleSave}>
          <Stack spacing={6}>
            <FileUpload
              userId={userId}
              bucket="logos"
              currentUrl={formData.logo_url}
              onUploadComplete={(url) => setFormData({ ...formData, logo_url: url })}
            />

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired>
                <FormLabel fontWeight="bold">Название компании</FormLabel>
                <Input
                  leftIcon={<Building2 size={18} />}
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="Например: EuroBuild Group"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontWeight="bold">Сайт компании</FormLabel>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://company.com"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired>
              <FormLabel fontWeight="bold">Отрасль</FormLabel>
              <Input
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Например: Строительство, Логистика"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontWeight="bold">О компании</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Расскажите о вашей компании, ценностях и почему стоит работать именно у вас..."
                rows={8}
              />
            </FormControl>

            <Box p={4} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
              <Flex align="center">
                <Info size={20} color="#3182ce" />
                <Text ml={3} fontSize="sm" color="blue.700">
                  Полное и качественное описание компании повышает количество откликов на 40%.
                </Text>
              </Flex>
            </Box>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              isLoading={saving}
              loadingText="Сохранение..."
              w={{ base: 'full', md: 'auto' }}
            >
              Сохранить профиль
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
}
