'use client'

import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Box,
  Heading,
  Icon,
} from '@chakra-ui/react'
import { Search, Filter, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function VacancyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [country, setCountry] = useState(searchParams.get('country') || '')
  const [jobType, setJobType] = useState(searchParams.get('type') || '')

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (country) params.set('country', country)
    if (jobType) params.set('type', jobType)
    
    router.push(`/vacancies?${params.toString()}`)
  }

  const handleClear = () => {
    setQuery('')
    setCountry('')
    setJobType('')
    router.push('/vacancies')
  }

  return (
    <Stack spacing={6} p={6} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100" shadow="sm">
      <Heading size="sm" display="flex" alignItems="center">
        <Icon as={Filter} mr={2} size={18} /> Фильтры
      </Heading>

      <FormControl>
        <FormLabel fontSize="sm">Поиск</FormLabel>
        <Input
          placeholder="Название, навыки..."
          size="sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">Страна</FormLabel>
        <Select
          size="sm"
          placeholder="Все страны"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="Германия">Германия</option>
          <option value="Польша">Польша</option>
          <option value="Франция">Франция</option>
          <option value="Нидерланды">Нидерланды</option>
          <option value="Чехия">Чехия</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">Тип занятости</FormLabel>
        <Select
          size="sm"
          placeholder="Любой"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="FULL_TIME">Полный день</option>
          <option value="PART_TIME">Частичная</option>
          <option value="CONTRACT">Контракт</option>
          <option value="TEMPORARY">Временная</option>
        </Select>
      </FormControl>

      <Stack spacing={2}>
        <Button
          colorScheme="blue"
          size="sm"
          leftIcon={<Icon as={Search} size={14} />}
          onClick={handleFilter}
        >
          Применить
        </Button>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Icon as={X} size={14} />}
          onClick={handleClear}
        >
          Сбросить
        </Button>
      </Stack>
    </Stack>
  )
}
