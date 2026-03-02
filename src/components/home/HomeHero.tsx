'use client'

import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
  Icon,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react'
import { Sparkles } from 'lucide-react'

export default function HomeHero() {
  return (
    <Box 
      bg={useColorModeValue('white', 'gray.900')} 
      pt={{ base: 12, md: 20 }} 
      pb={{ base: 8, md: 12 }}
      borderBottom="1px solid"
      borderColor={useColorModeValue('gray.50', 'gray.800')}
    >
      <Container maxW="7xl">
        <Stack spacing={4} align="center" textAlign="center">
          <Flex 
            align="center" 
            bg="blue.50" 
            px={3} 
            py={1} 
            borderRadius="full" 
            color="blue.600"
            fontSize="sm"
            fontWeight="bold"
          >
            <Icon as={Sparkles} mr={2} size={14} />
            Прямые вакансии от европейских компаний
          </Flex>
          
          <Heading 
            as="h1" 
            size="2xl" 
            fontWeight="800" 
            lineHeight="1.2"
            letterSpacing="tight"
          >
            Найдите достойную работу <br />
            <Text as="span" color="blue.500">в любой точке Европы</Text>
          </Heading>
          
          <Text fontSize="lg" color="gray.500" maxW="2xl">
            Специализированная платформа для строителей, водителей и тех, кто создает 
            реальные вещи. Мы помогаем найти работу без посредников и скрытых комиссий.
          </Text>
        </Stack>
      </Container>
    </Box>
  )
}
