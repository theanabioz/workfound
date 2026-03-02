'use client'

import { useState } from 'react'
import { Button, Text, Icon, Box, HStack } from '@chakra-ui/react'
import { Phone, Eye } from 'lucide-react'

interface PhoneButtonProps {
  phoneNumber: string
}

export default function PhoneButton({ phoneNumber }: PhoneButtonProps) {
  const [showPhone, setShowPhone] = useState(false)

  if (showPhone) {
    return (
      <Button
        as="a"
        href={`tel:${phoneNumber}`}
        colorScheme="green"
        size="lg"
        w="full"
        leftIcon={<Icon as={Phone} />}
      >
        {phoneNumber}
      </Button>
    )
  }

  return (
    <Button
      colorScheme="green"
      variant="outline"
      size="lg"
      w="full"
      leftIcon={<Icon as={Eye} />}
      onClick={() => setShowPhone(true)}
    >
      Показать номер телефона
    </Button>
  )
}
