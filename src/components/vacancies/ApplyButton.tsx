'use client'

import { useState, useEffect } from 'react'
import { Button, useToast, Text, Stack, Box, Icon } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { CheckCircle2, AlertCircle, LogIn } from 'lucide-react'
import Link from 'next/link'

interface ApplyButtonProps {
  vacancyId: string
}

export default function ApplyButton({ vacancyId }: ApplyButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const supabase = createClient()
  const toast = useToast()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        
        // Получаем роль
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        setRole(profile?.role || null)

        // Проверяем, был ли уже отклик
        const { data: application } = await supabase
          .from('applications')
          .select('id')
          .eq('vacancy_id', vacancyId)
          .eq('worker_id', user.id)
          .single()
        
        if (application) {
          setHasApplied(true)
        }
      }
      setIsChecking(false)
    }

    checkUser()
  }, [vacancyId])

  const handleApply = async () => {
    if (!user) return

    setIsLoading(true)
    const { error } = await supabase
      .from('applications')
      .insert([
        {
          vacancy_id: vacancyId,
          worker_id: user.id,
          status: 'PENDING'
        }
      ])

    if (error) {
      toast({
        title: 'Ошибка отклика',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } else {
      setHasApplied(true)
      toast({
        title: 'Отклик успешно отправлен!',
        description: 'Работодатель увидит ваше резюме.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
    setIsLoading(false)
  }

  if (isChecking) {
    return <Button isLoading w="full" size="lg" />
  }

  // Если пользователь не авторизован
  if (!user) {
    return (
      <Stack spacing={4} w="full">
        <Button
          as={Link}
          href="/login"
          colorScheme="blue"
          size="lg"
          leftIcon={<Icon as={LogIn} />}
        >
          Войдите, чтобы откликнуться
        </Button>
        <Text fontSize="xs" color="gray.500" textAlign="center">
          Нужен аккаунт соискателя для отправки отклика.
        </Text>
      </Stack>
    )
  }

  // Если это работодатель (он не может откликаться на вакансии)
  if (role === 'EMPLOYER') {
    return (
      <Box p={4} bg="orange.50" borderRadius="md" border="1px solid" borderColor="orange.200">
        <Stack direction="row" align="center">
          <Icon as={AlertCircle} color="orange.500" />
          <Text fontSize="sm" color="orange.700">
            Вы вошли как работодатель. Отклики доступны только соискателям.
          </Text>
        </Stack>
      </Box>
    )
  }

  // Если уже откликнулся
  if (hasApplied) {
    return (
      <Button
        w="full"
        size="lg"
        colorScheme="green"
        variant="outline"
        isDisabled
        leftIcon={<Icon as={CheckCircle2} />}
      >
        Вы уже откликнулись
      </Button>
    )
  }

  return (
    <Button
      colorScheme="blue"
      size="lg"
      w="full"
      isLoading={isLoading}
      onClick={handleApply}
      loadingText="Отправка..."
    >
      Отправить отклик
    </Button>
  )
}
