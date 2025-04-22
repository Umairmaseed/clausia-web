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
  Text,
  Flex,
} from '@chakra-ui/react'
import Select from 'react-select'
import { useAuth } from '../../context/Authcontext'
import { ClauseService } from '../../services/clause'
import { ActionType } from '../../utils/actionType'
import { useToast } from '@chakra-ui/react'

interface GetDeductionData {
  fineName?: string
  maxPercentage?: number
  maxReferenceValue?: number
  imposeFine?: boolean
}

interface GetDeductionFormProps {
  autoExecutableContract?: AutoExecutableContract
  setOpenClauseModel: (value: boolean) => void
  fetchContract: () => void
}

const GetDeductionForm: React.FC<GetDeductionFormProps> = ({
  autoExecutableContract,
  setOpenClauseModel,
  fetchContract,
}) => {
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [fineName, setFineName] = useState<string>('')
  const [maxPercentage, setMaxPercentage] = useState<number>(10)
  const [maxReferenceValue, setMaxReferenceValue] = useState<string>('')
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
    actionType: ActionType.GetDeduction.toFixed(1),
  })

  const handleSubmit = async () => {
    setLoading(true)
    setOpenClauseModel(false)

    const parameters: GetDeductionData = {
      fineName: fineName || 'calculateFine',
      maxPercentage,
      maxReferenceValue: maxReferenceValue
        ? parseFloat(maxReferenceValue)
        : undefined,
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
          <FormLabel>Fine Name</FormLabel>
          <Input
            placeholder="Enter fine name"
            value={fineName}
            onChange={(e) => setFineName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Max Percentage: {maxPercentage}%</FormLabel>
          <Text fontSize="sm" color="gray.500">
            Define the maximum allowable percentage for this clause. If the
            input percentage exceeds this limit, the system will apply the
            maximum value as the cap.
          </Text>
          <Slider
            value={maxPercentage}
            onChange={setMaxPercentage}
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
          <FormLabel>Max Reference Value</FormLabel>
          <Text fontSize="sm" color="gray.500">
            Define the maximum reference value for this clause. This value will
            be used as a cap when calculating the deduction. If the reference
            value provided in the input exceeds this limit, the system will
            apply the maximum value as the cap.
          </Text>
          <NumberInput>
            <NumberInputField
              placeholder="Enter max reference value"
              value={maxReferenceValue}
              onChange={(e) => setMaxReferenceValue(e.target.value)}
            />
          </NumberInput>
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

export default GetDeductionForm
