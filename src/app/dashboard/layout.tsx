'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  Flex,
  IconButton,
  Icon,
  Text,
} from '@chakra-ui/react'
import { Menu, Briefcase } from 'lucide-react'
import SidebarContent from '@/components/dashboard/Sidebar'
import { createClient } from '@/utils/supabase/client'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUserData = async () => {
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
    getUserData()
  }, [])

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Sidebar для десктопа */}
      <SidebarContent
        display={{ base: 'none', md: 'block' }}
        role={role}
        email={user?.email}
      />

      {/* Drawer для мобильных */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} role={role} email={user?.email} />
        </DrawerContent>
      </Drawer>

      {/* Мобильная шапка (только на мобильных) */}
      <Flex
        display={{ base: 'flex', md: 'none' }}
        ml={{ base: 0, md: '280px' }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        justifyContent="flex-start"
      >
        <IconButton
          variant="ghost"
          onClick={onOpen}
          icon={<Icon as={Menu} />}
          aria-label="open menu"
        />
        <Text fontSize="2xl" ml="8" fontWeight="bold" color="blue.600" display="flex" alignItems="center">
          <Icon as={Briefcase} mr={2} />
          WorkFound
        </Text>
      </Flex>

      {/* Основной контент */}
      <Box ml={{ base: 0, md: '280px' }} transition="margin-left 0.3s">
        {children}
      </Box>
    </Box>
  )
}
