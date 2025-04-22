import { useState } from 'react'
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
  NumberInput,
  NumberInputField,
  Checkbox,
  Flex,
} from '@chakra-ui/react'
import Select from 'react-select'
import { useAuth } from '../../context/Authcontext'
import { ClauseService } from '../../services/clause'
import { ActionType } from '../../utils/actionType'
import { useToast } from '@chakra-ui/react'

interface GetCreditData {
  imposeCredit?: boolean
  creditName?: string
  percentage?: number
  predefinedValue?: number
  reviewCondition?: boolean
}

interface GetCreditFormProps {
  autoExecutableContract?: AutoExecutableContract
  setOpenClauseModel: (value: boolean) => void
  fetchContract: () => void
}

const GetCreditForm: React.FC<GetCreditFormProps> = ({
  autoExecutableContract,
  setOpenClauseModel,
  fetchContract,
}) => {
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [creditName, setCreditName] = useState<string>('')
  const [percentage, setPercentage] = useState<number>(10)
  const [predefinedValue, setPredefinedValue] = useState<string>('')
  const [imposeCredit, setImposeCredit] = useState<boolean>(false)
  const [reviewCondition, setReviewCondition] = useState<boolean>(false)
  const { setLoading } = useAuth()
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
    actionType: ActionType.GetCredit.toFixed(1),
  })

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

  const handleSubmit = async () => {
    setLoading(true)
    setOpenClauseModel(false)

    const parameters: GetCreditData = {
      imposeCredit,
      creditName: creditName || 'defaultCredit',
      percentage,
      predefinedValue: predefinedValue
        ? parseFloat(predefinedValue)
        : undefined,
      reviewCondition,
    }

    const updatedFormData = {
      ...formData,
      description,
      category,
      parameters,
    }

    try {
      const response = await ClauseService.AddClause(updatedFormData)
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
    }
    setLoading(false)
  }

  const options =
    autoExecutableContract?.clauses?.map((clause) => ({
      value: clause.id,
      label: clause.description,
    })) || []

  return (
    <Box py={4}>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Category</FormLabel>
          <Input
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Credit Name</FormLabel>
          <Input
            placeholder="Enter credit name"
            value={creditName}
            onChange={(e) => setCreditName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Percentage: {percentage}%</FormLabel>
          <Slider
            value={percentage}
            onChange={setPercentage}
            min={0}
            max={100}
            step={0.5}
          >
            <SliderTrack>
              <SliderFilledTrack background="orange" />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>

        <FormControl>
          <FormLabel>Predefined Value</FormLabel>
          <NumberInput>
            <NumberInputField
              placeholder="Enter predefined value"
              value={predefinedValue}
              onChange={(e) => setPredefinedValue(e.target.value)}
            />
          </NumberInput>
        </FormControl>

        <FormControl>
          <Checkbox
            isChecked={imposeCredit}
            onChange={(e) => setImposeCredit(e.target.checked)}
          >
            Impose Credit
          </Checkbox>
        </FormControl>

        <FormControl>
          <Checkbox
            isChecked={reviewCondition}
            onChange={(e) => setReviewCondition(e.target.checked)}
          >
            Review Condition
          </Checkbox>
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
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </Flex>
      </VStack>
    </Box>
  )
}

export default GetCreditForm
