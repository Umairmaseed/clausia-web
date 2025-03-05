import React, { useEffect, useState } from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  HStack,
  Select,
  Flex,
  useToast,
} from '@chakra-ui/react'
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

  const handleChange = (key: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleParameterChange = (key: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      parameters: { ...prev.parameters, [key]: value },
    }))
  }

  const handleDateChange = (value: string) => {
    setDateInput(value)
    const date = new Date(value)

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

  return (
    <VStack spacing={4} py={4} align="start">
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
        <FormLabel size="md">Please select the reference date</FormLabel>
        <Input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => handleDateChange(e.target.value)}
          width="50%"
        />
      </FormControl>

      {autoExecutableContract &&
        autoExecutableContract.clauses &&
        autoExecutableContract?.clauses?.length > 0 && (
          <FormControl>
            <FormLabel>Dependencies</FormLabel>
            <Select
              placeholder="Select dependencies"
              multiple
              onChange={(e) => {
                const selectedIds = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                )
                handleDependenciesChange(selectedIds)
              }}
            >
              {autoExecutableContract?.clauses?.map((clause) => (
                <option key={clause.id} value={clause.id}>
                  {clause.description}
                </option>
              ))}
            </Select>
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
