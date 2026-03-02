'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  IconButton,
  Icon,
  Avatar,
  Stack,
  useToast,
  Divider,
} from '@chakra-ui/react'
import { Send, Clock } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
}

interface ChatWindowProps {
  applicationId: string
  currentUserId: string
}

export default function ChatWindow({ applicationId, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const supabase = createClient()
  const toast = useToast()
  const scrollRef = useRef<HTMLDivElement>(null)

  // 1. Загрузка истории сообщений
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
      } else {
        setMessages(data || [])
      }
    }

    fetchMessages()

    // 2. Подписка на Realtime сообщения
    const channel = supabase
      .channel(`chat:${applicationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `application_id=eq.${applicationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [applicationId])

  // 3. Авто-прокрутка вниз
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // 4. Отправка сообщения
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          application_id: applicationId,
          sender_id: currentUserId,
          content: newMessage.trim(),
        }
      ])

    if (error) {
      toast({
        title: 'Ошибка отправки',
        description: error.message,
        status: 'error',
      })
    } else {
      setNewMessage('')
    }
    setSending(false)
  }

  return (
    <Box h="400px" display="flex" flexDirection="column" border="1px solid" borderColor="gray.100" borderRadius="xl" bg="white" shadow="sm">
      {/* Сообщения */}
      <VStack
        flex={1}
        overflowY="auto"
        p={4}
        spacing={4}
        align="stretch"
        ref={scrollRef}
        sx={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { bg: 'gray.200', borderRadius: '4px' },
        }}
      >
        {messages.length === 0 && (
          <Box textAlign="center" py={10}>
            <Text fontSize="sm" color="gray.400">Начните переписку прямо сейчас</Text>
          </Box>
        )}
        {messages.map((msg) => (
          <Box
            key={msg.id}
            alignSelf={msg.sender_id === currentUserId ? 'flex-end' : 'flex-start'}
            maxW="80%"
          >
            <HStack spacing={2} align="flex-end" flexDirection={msg.sender_id === currentUserId ? 'row-reverse' : 'row'}>
              <Box
                bg={msg.sender_id === currentUserId ? 'blue.500' : 'gray.100'}
                color={msg.sender_id === currentUserId ? 'white' : 'gray.800'}
                px={4}
                py={2}
                borderRadius="lg"
                borderTopRightRadius={msg.sender_id === currentUserId ? '0' : 'lg'}
                borderTopLeftRadius={msg.sender_id === currentUserId ? 'lg' : '0'}
              >
                <Text fontSize="sm">{msg.content}</Text>
                <Text fontSize="10px" opacity={0.7} textAlign="right" mt={1}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </VStack>

      <Divider />

      {/* Поле ввода */}
      <Box p={4}>
        <form onSubmit={handleSend}>
          <HStack>
            <Input
              placeholder="Ваше сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              bg="gray.50"
              border="none"
              _focus={{ bg: 'white', border: '1px solid', borderColor: 'blue.300' }}
            />
            <IconButton
              type="submit"
              colorScheme="blue"
              icon={<Icon as={Send} size={18} />}
              aria-label="Send"
              isLoading={sending}
              isDisabled={!newMessage.trim()}
            />
          </HStack>
        </form>
      </Box>
    </Box>
  )
}
