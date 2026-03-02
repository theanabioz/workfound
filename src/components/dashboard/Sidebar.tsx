'use client'

import React from 'react'
import {
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Stack,
  BoxProps,
  FlexProps,
  Avatar,
  Divider,
  CloseButton,
} from '@chakra-ui/react'
import {
  LayoutDashboard,
  Briefcase,
  User,
  MessageSquare,
  FileText,
  PlusCircle,
  Search,
  Settings,
  LogOut,
  Building2,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface NavItemProps extends FlexProps {
  icon: any
  children: string
  href: string
  active?: boolean
  onClick?: () => void
}

const NavItem = ({ icon, children, href, active, onClick, ...rest }: NavItemProps) => {
  const activeBg = useColorModeValue('blue.50', 'blue.900')
  const activeColor = useColorModeValue('blue.600', 'blue.200')

  return (
    <Link href={href} style={{ textDecoration: 'none' }} onClick={onClick}>
      <Flex
        align="center"
        p="3"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={active ? activeBg : 'transparent'}
        color={active ? activeColor : 'inherit'}
        fontWeight={active ? 'semibold' : 'medium'}
        transition="all 0.2s"
        _hover={{
          bg: activeBg,
          color: activeColor,
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="3"
            fontSize="20"
            as={icon}
          />
        )}
        <Text fontSize="sm" whiteSpace="nowrap">
          {children}
        </Text>
      </Flex>
    </Link>
  )
}

interface SidebarProps extends BoxProps {
  role: string | null
  email: string | null
  onClose?: () => void
}

export default function SidebarContent({ role, email, onClose, ...rest }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
    if (onClose) onClose()
  }

  const workerItems = [
    { name: 'Обзор', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Поиск работы', icon: Search, href: '/vacancies' },
    { name: 'Мои отклики', icon: FileText, href: '/dashboard/worker/applications' },
    { name: 'Мой профиль', icon: User, href: '/dashboard/worker/profile' },
  ]

  const employerItems = [
    { name: 'Обзор', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Мои вакансии', icon: Briefcase, href: '/dashboard/employer/vacancies' },
    { name: 'Создать вакансию', icon: PlusCircle, href: '/dashboard/employer/vacancies/create' },
    { name: 'Профиль компании', icon: Building2, href: '/dashboard/employer/profile' },
  ]

  const navItems = role === 'EMPLOYER' ? employerItems : workerItems

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: '280px' }}
      pos="fixed"
      h="full"
      display="flex"
      flexDirection="column"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold" color="blue.600" display="flex" alignItems="center">
          <Icon as={Briefcase} mr={2} />
          WorkFound
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      <Stack spacing={1} flex={1}>
        {navItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            href={link.href}
            active={pathname === link.href}
            onClick={onClose}
          >
            {link.name}
          </NavItem>
        ))}
      </Stack>

      <Box p={4}>
        <Divider mb={4} />
        <Stack spacing={2}>
          <Flex align="center" px={4} py={2}>
            <Avatar size="sm" name={email || ''} mr={3} />
            <Box overflow="hidden">
              <Text fontSize="xs" fontWeight="bold" isTruncated>
                {email}
              </Text>
              <Text fontSize="10px" color="gray.500" textTransform="uppercase">
                {role === 'EMPLOYER' ? 'Работодатель' : 'Соискатель'}
              </Text>
            </Box>
          </Flex>
          <NavItem 
            icon={LogOut} 
            href="#" 
            onClick={handleLogout}
          >
            Выйти
          </NavItem>
        </Stack>
      </Box>
    </Box>
  )
}
