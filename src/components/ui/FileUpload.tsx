'use client'

import { useState } from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Avatar,
  Text,
  useToast,
  HStack,
  Spinner,
} from '@chakra-ui/react'
import { createClient } from '@/utils/supabase/client'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  userId: string
  bucket: 'logos' | 'resumes'
  onUploadComplete: (url: string) => void
  currentUrl?: string
  accept?: string
}

export default function FileUpload({ userId, bucket, onUploadComplete, currentUrl, accept }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()
  const toast = useToast()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Выберите файл для загрузки')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      // Загрузка в Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Получаем публичную ссылку (для логотипов) или обычную (для резюме)
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      onUploadComplete(publicUrl)
      
      toast({
        title: 'Загрузка успешна',
        status: 'success',
        duration: 3000,
      })
    } catch (error: any) {
      toast({
        title: 'Ошибка загрузки',
        description: error.message,
        status: 'error',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <FormControl>
      <FormLabel fontSize="sm" fontWeight="bold">
        {bucket === 'logos' ? 'Логотип компании' : 'Файл резюме (PDF)'}
      </FormLabel>
      <HStack spacing={4}>
        {bucket === 'logos' && (
          <Avatar size="lg" src={currentUrl} name="Company Logo" />
        )}
        <VStack align="start" spacing={1}>
          <Button
            as="label"
            htmlFor={`file-upload-${bucket}`}
            leftIcon={uploading ? <Spinner size="xs" /> : <Upload size={16} />}
            cursor="pointer"
            size="sm"
            isLoading={uploading}
            colorScheme="blue"
            variant="outline"
          >
            {currentUrl ? 'Заменить' : 'Загрузить'}
            <input
              type="file"
              id={`file-upload-${bucket}`}
              hidden
              accept={accept || 'image/*'}
              onChange={handleUpload}
              disabled={uploading}
            />
          </Button>
          <Text fontSize="xs" color="gray.500">
            {bucket === 'logos' ? 'PNG, JPG до 2MB' : 'PDF до 5MB'}
          </Text>
        </VStack>
      </HStack>
    </FormControl>
  )
}
