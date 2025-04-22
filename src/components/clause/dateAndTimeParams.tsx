import React, { useEffect, useState } from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  HStack,
  Flex,
  useToast,
  Text,
  Box,
} from '@chakra-ui/react'
import Select from 'react-select'
import { ActionType } from '../../utils/actionType'
import { ClauseService } from '../../services/clause'
import { useAuth } from '../../context/Authcontext'

const INTERVAL_TYPES = [
  { label: 'Days', value: 1 },
  { label: 'Weeks', value: 2 },
  { label: 'Months', value: 3 },
  { label: 'Years', value: 4 },
]

interface Props {
  autoExecutableContract?: AutoExecutableContract
  setOpenClauseModel: (value: boolean) => void
  fetchContract: () => void
}

const DateAndTimeParams: React.FC<Props> = ({
  autoExecutableContract,
  setOpenClauseModel,
  fetchContract,
}) => {
  const { setLoading } = useAuth()
  const [dateInput, setDateInput] = useState<string>('')
  const [contractHaveDates, setContractHaveDates] = useState(false)
  const [contractDates, setContractDates] = useState<Record<string, any>>({})
  const toast = useToast()
  const [formData, setFormData] = useState<AddClauseForm>({
    autoExecutableContract: autoExecutableContract
      ? {
          '@assetType': autoExecutableContract['@assetType'],
          '@key': autoExecutableContract['@key'],
        }
      : ({} as AutoExecutableContract),
    id: `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    description: '',
    category: '',
    parameters: {},
    input: {},
    dependencies: [],
    actionType: ActionType.CheckDateInterval.toFixed(1),
  })

  useEffect(() => {
    const fetchedParams = {
      intervalType: 1,
      deadlineInterval: 1,
      referenceDate: new Date().toISOString().slice(0, 16),
    }

    setFormData((prev) => ({
      ...prev,
      parameters: fetchedParams,
    }))
    setDateInput(fetchedParams.referenceDate)
  }, [])

  useEffect(() => {
    if (autoExecutableContract?.dates) {
      const dates = Object.keys(autoExecutableContract.dates)
      if (dates.length > 0) {
        setContractHaveDates(true)
        setContractDates(autoExecutableContract.dates)
      }
    }
  }, [autoExecutableContract])

  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleParameterChange = (key: string, value: string | number) => {
    const isNumericString =
      typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))
    const parsedValue = isNumericString ? Number(value) : value

    setFormData((prev) => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [key]: parsedValue,
      },
    }))
  }

  const handleDateChange = (value: string) => {
    setDateInput(value)

    const date = new Date(value)
    if (isNaN(date.getTime())) {
      toast({
        title: 'Invalid Date',
        description: 'Please enter a valid date.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    const formattedDate = date.toISOString().split('.')[0] + 'Z'

    handleParameterChange('referenceDate', formattedDate)
  }

  const handleDependenciesChange = (selectedClauseIds: string[]) => {
    if (!autoExecutableContract?.clauses) return

    const selectedClauses = autoExecutableContract.clauses.filter((clause) =>
      selectedClauseIds.includes(clause.id)
    )

    setFormData((prev) => ({
      ...prev,
      dependencies: selectedClauses,
    }))
  }

  const submitClause = async () => {
    setLoading(true)
    setOpenClauseModel(false)
    try {
      const response = await ClauseService.AddClause(formData)
      if (response.status === 200) {
        fetchContract()
        toast({
          title: 'Success',
          description: 'Clause submitted successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        throw new Error('Error submitting clause')
      }
    } catch (error) {
      setOpenClauseModel(true)
      toast({
        title: 'Error',
        description: 'Error submitting clause',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setLoading(false)
    }
    setLoading(false)
  }

  const formatDate = (inputDate: number | string | Date) => {
    const date = new Date(inputDate)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const options =
    autoExecutableContract?.clauses?.map((clause) => ({
      value: clause.id,
      label: clause.description,
    })) || []

  return (
    <VStack spacing={4} py={4} align="start">
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter name"
          value={formData.parameters.name || ''}
          onChange={(e) => handleParameterChange('name', e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Input
          placeholder="Enter description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Category</FormLabel>
        <Input
          placeholder="Enter category"
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Interval Type</FormLabel>
        <Text fontSize="sm" color="gray.500" mb={2}>
          Please select the interval type from the options below.
        </Text>
        <HStack>
          {INTERVAL_TYPES.map(({ label, value }) => (
            <Button
              size="xs"
              key={value}
              onClick={() => handleParameterChange('intervalType', value)}
              colorScheme={
                formData.parameters.intervalType === value ? 'orange' : 'gray'
              }
            >
              {label}
            </Button>
          ))}
        </HStack>
      </FormControl>

      <FormControl>
        <FormLabel>Deadline Interval</FormLabel>
        <Text fontSize="sm" color="gray.500" mb={2}>
          Based on the selected interval type, please enter the deadline
          interval provided the reference date.
        </Text>
        <Input
          placeholder="Enter deadline interval"
          value={formData.parameters.deadlineInterval || ''}
          onChange={(e) =>
            handleParameterChange('deadlineInterval', e.target.value)
          }
          width="50%"
        />
      </FormControl>

      <FormControl>
        <FormLabel size="md">Reference Date</FormLabel>
        <Text fontSize="sm" color="gray.500" mb={2}>
          Please provide a reference date that will serve as the starting point
          for evaluating the clause
        </Text>
        {contractHaveDates && (
          <VStack spacing={4} align="start" mb={4}>
            <HStack spacing={4} wrap="wrap">
              {Object.keys(contractDates)
                .filter((dateKey) => !dateKey.startsWith('@'))
                .map((dateKey) => {
                  const formattedKey = dateKey
                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                    .replace(/^./, (str: any) => str.toUpperCase())
                  return (
                    <Box
                      key={dateKey}
                      bg={'teal.100'}
                      p={2}
                      borderRadius="md"
                      boxShadow="sm"
                      cursor="pointer"
                      _hover={{
                        bg: 'teal.200',
                        transform: 'scale(1.05)',
                        transition: '0.2s',
                      }}
                      onClick={() => {
                        handleDateChange(formatDate(contractDates[dateKey]))
                      }}
                      transition="0.2s"
                    >
                      <Text color={'teal.800'} fontSize="smaller">
                        {formattedKey}
                      </Text>
                    </Box>
                  )
                })}
            </HStack>
          </VStack>
        )}

        <Text fontSize="sm" color="gray.500" mb={2}>
          Or input your own reference date:
        </Text>

        <Input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => handleDateChange(e.target.value)}
          width="50%"
          borderColor="teal.300"
          _focus={{ borderColor: 'teal.500' }}
          mb={4}
        />
      </FormControl>

      {autoExecutableContract &&
        autoExecutableContract.clauses &&
        autoExecutableContract?.clauses?.length > 0 && (
          <FormControl>
            <FormLabel>Dependencies</FormLabel>
            <Select
              isMulti
              options={options}
              onChange={(selectedOptions) => {
                const selectedIds = selectedOptions.map(
                  (option) => option.value
                )
                handleDependenciesChange(selectedIds)
              }}
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
            />
          </FormControl>
        )}
      <Flex my={4}>
        <Button
          colorScheme="blue"
          mr={3}
          size="sm"
          variant={'outline'}
          onClick={() => setOpenClauseModel(false)}
        >
          Cancel
        </Button>
        <Button
          colorScheme="green"
          mr={3}
          size="sm"
          onClick={() => submitClause()}
        >
          Submit
        </Button>
      </Flex>
    </VStack>
  )
}

export default DateAndTimeParams
