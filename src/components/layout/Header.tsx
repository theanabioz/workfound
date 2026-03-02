'use client'

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Container,
} from '@chakra-ui/react'
import {
  Menu as MenuIcon,
  X as CloseIcon,
  ChevronDown as ChevronDownIcon,
  Briefcase,
  Search,
  User,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header() {
  const { isOpen, onToggle } = useDisclosure()
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setRole(profile?.role || null)
      }
    }
    fetchUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    router.push('/')
    router.refresh()
  }

  return (
    <Box borderBottom={1} borderStyle={'solid'} borderColor={useColorModeValue('gray.200', 'gray.900')} bg={'white'} position="sticky" top={0} zIndex={10}>
      <Container maxW={'7xl'}>
        <Flex
          bg={'white'}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4, md: 0 }}
          align={'center'}
        >
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}
          >
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <Icon as={CloseIcon} w={5} h={5} /> : <Icon as={MenuIcon} w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Link href="/" passHref>
              <Text
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                fontFamily={'heading'}
                fontWeight="bold"
                fontSize="xl"
                color={useColorModeValue('blue.600', 'white')}
                display="flex"
                alignItems="center"
              >
                <Icon as={Briefcase} mr={2} />
                WorkFound
              </Text>
            </Link>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav role={role} />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}
          >
            {!user ? (
              <>
                <Button
                  as={Link}
                  fontSize={'sm'}
                  fontWeight={400}
                  variant={'link'}
                  href={'/login'}
                >
                  Войти
                </Button>
                <Button
                  as={Link}
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'blue.500'}
                  href={'/register'}
                  _hover={{
                    bg: 'blue.400',
                  }}
                >
                  Регистрация
                </Button>
              </>
            ) : (
              <Button
                variant={'ghost'}
                leftIcon={<Icon as={LogOut} />}
                onClick={handleSignOut}
                fontSize={'sm'}
              >
                Выйти
              </Button>
            )}
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav role={role} />
        </Collapse>
      </Container>
    </Box>
  )
}

const DesktopNav = ({ role }: { role: string | null }) => {
  const navItems = getNavItems(role)
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return (
    <Stack direction={'row'} spacing={4}>
      {navItems.map((navItem) => (
        <Box key={navItem.label}>
          <ChakraLink
            as={Link}
            href={navItem.href ?? '#'}
            p={2}
            fontSize={'sm'}
            fontWeight={500}
            color={linkColor}
            _hover={{
              textDecoration: 'none',
              color: linkHoverColor,
            }}
          >
            {navItem.label}
          </ChakraLink>
        </Box>
      ))}
    </Stack>
  )
}

const MobileNav = ({ role }: { role: string | null }) => {
  const navItems = getNavItems(role)
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.200')

  return (
    <Stack bg={bgColor} p={4} display={{ md: 'none' }}>
      {navItems.map((navItem) => (
        <Stack spacing={4} key={navItem.label}>
          <Flex
            py={2}
            as={Link}
            href={navItem.href ?? '#'}
            justify={'space-between'}
            align={'center'}
            _hover={{
              textDecoration: 'none',
            }}
          >
            <Text fontWeight={600} color={textColor}>
              {navItem.label}
            </Text>
          </Flex>
        </Stack>
      ))}
    </Stack>
  )
}

function getNavItems(role: string | null) {
  if (role === 'EMPLOYER') {
    return [
      { label: 'Кабинет', href: '/dashboard' },
      { label: 'Мои вакансии', href: '/dashboard/vacancies' },
      { label: 'Поиск соискателей', href: '/workers' },
    ]
  } else if (role === 'WORKER') {
    return [
      { label: 'Кабинет', href: '/dashboard' },
      { label: 'Поиск работы', href: '/vacancies' },
      { label: 'Мои отклики', href: '/dashboard/applications' },
    ]
  }
  return [
    { label: 'Вакансии', href: '/vacancies' },
    { label: 'Для компаний', href: '/employer-info' },
  ]
}
