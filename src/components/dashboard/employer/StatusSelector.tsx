'use client'

import { useState } from 'react'
import { Select, useToast } from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface StatusSelectorProps {
  applicationId: string
  currentStatus: string
}

export default function StatusSelector({ applicationId, currentStatus }: StatusSelectorProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const toast = useToast()
  const router = useRouter()

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true)
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId)

    if (error) {
      toast({
        title: 'Ошибка обновления статуса',
        description: error.message,
        status: 'error',
      })
    } else {
      setStatus(newStatus)
      toast({
        title: 'Статус обновлен',
        status: 'success',
        duration: 2000,
      })
      router.refresh() // Обновляем серверные данные
    }
    setLoading(false)
  }

  return (
    <Select
      size="sm"
      value={status}
      isDisabled={loading}
      onChange={(e) => handleStatusChange(e.target.value)}
      borderRadius="md"
    >
      <option value="PENDING">Ожидание</option>
      <option value="REVIEWING">Рассмотрение</option>
      <option value="INTERVIEW">Интервью</option>
      <option value="OFFER">Оффер</option>
      <option value="REJECTED">Отказ</option>
    </Select>
  )
}
