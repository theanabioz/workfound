'use client'

import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import { Briefcase, Users, Search, Globe } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Container maxW={'3xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
          >
            Работа в Европе <br />
            <Text as={'span'} color={'blue.500'}>
              для специалистов
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Современная платформа для поиска работы в европейских компаниях. 
            Акцент на рабочие профессии: строители, водители, складские работники и многие другие. 
            Прямое взаимодействие с работодателями.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          >
            <Button
              as={Link}
              href="/register"
              colorScheme={'blue'}
              bg={'blue.500'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'blue.600',
              }}
              size="lg"
            >
              Начать поиск
            </Button>
            <Button as={Link} href="/login" variant={'link'} colorScheme={'blue'} size={'sm'}>
              Уже есть аккаунт? Войти
            </Button>
          </Stack>
        </Stack>
      </Container>

      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={20}>
        <Container maxW={'6xl'}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={<Icon as={Briefcase} w={10} h={10} color={'blue.500'} />}
              title={'Проверенные вакансии'}
              text={
                'Мы работаем напрямую с европейскими работодателями и агентствами.'
              }
            />
            <Feature
              icon={<Icon as={Users} w={10} h={10} color={'blue.500'} />}
              title={'Прямой чат'}
              text={
                'Общайтесь с работодателем напрямую через встроенную систему сообщений.'
              }
            />
            <Feature
              icon={<Icon as={Globe} w={10} h={10} color={'blue.500'} />}
              title={'Вся Европа'}
              text={
                'Вакансии в Германии, Польше, Франции, Нидерландах и других странах.'
              }
            />
          </SimpleGrid>
        </Container>
      </Box>
    </>
  )
}

interface FeatureProps {
  title: string
  text: string
  icon: React.ReactElement
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack align={'center'} textAlign={'center'}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'gray.100'}
        mb={1}
      >
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  )
}
