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
  SimpleGrid,
  Icon,
  Flex,
  VStack,
} from '@chakra-ui/react'
import { Briefcase, User } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type UserRole = 'WORKER' | 'EMPLOYER'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('WORKER')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
        },
      },
    })

    if (error) {
      toast({
        title: 'Ошибка регистрации',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Регистрация успешна!',
        description: 'Пожалуйста, проверьте свою почту для подтверждения.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      router.push('/login')
    }
    setIsLoading(false)
  }

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '4', sm: '8' }}>
      <Stack spacing="8">
        <Stack spacing="6" textAlign="center">
          <Heading size={{ base: 'xs', md: 'sm' }}>Создать аккаунт</Heading>
          <Text color="fg.muted">Начните поиск работы или сотрудников прямо сейчас</Text>
        </Stack>
        <Box
          py={{ base: '4', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg.surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
          borderWidth={{ base: '0', sm: '1px' }}
        >
          <form onSubmit={handleRegister}>
            <Stack spacing="6">
              <FormControl>
                <FormLabel>Я регистрируюсь как:</FormLabel>
                <SimpleGrid columns={2} spacing={4}>
                  <RoleCard
                    isSelected={role === 'WORKER'}
                    onClick={() => setRole('WORKER')}
                    icon={User}
                    label="Соискатель"
                  />
                  <RoleCard
                    isSelected={role === 'EMPLOYER'}
                    onClick={() => setRole('EMPLOYER')}
                    icon={Briefcase}
                    label="Работодатель"
                  />
                </SimpleGrid>
              </FormControl>

              <Stack spacing="5">
                <FormControl isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="password">Пароль</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" Минимум 6 символов"
                  />
                </FormControl>
              </Stack>
              <Stack spacing="6">
                <Button colorScheme="blue" type="submit" isLoading={isLoading} size="lg">
                  Зарегистрироваться
                </Button>
                <Text textAlign="center" fontSize="sm">
                  Уже есть аккаунт?{' '}
                  <Link href="/login" style={{ color: '#3182ce', fontWeight: 'bold' }}>
                    Войти
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  )
}

interface RoleCardProps {
  isSelected: boolean
  onClick: () => void
  icon: any
  label: string
}

function RoleCard({ isSelected, onClick, icon, label }: RoleCardProps) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      p={4}
      borderWidth="2px"
      borderRadius="lg"
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      bg={isSelected ? 'blue.50' : 'white'}
      _hover={{ borderColor: 'blue.300' }}
      transition="all 0.2s"
      w="100%"
    >
      <VStack spacing={2}>
        <Icon as={icon} boxSize={6} color={isSelected ? 'blue.500' : 'gray.500'} />
        <Text fontWeight="bold" fontSize="sm" color={isSelected ? 'blue.700' : 'gray.700'}>
          {label}
        </Text>
      </VStack>
    </Box>
  )
}
