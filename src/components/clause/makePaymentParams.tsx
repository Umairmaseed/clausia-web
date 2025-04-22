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

interface MakePaymentData {
  name: string
  amount: number
  paymentRate: number
  partialPayment: boolean
  addBonus: boolean
  addFine: boolean
  description: string
  category: string
  dependencies: string[]
}

interface MakePaymentFormProps {
  autoExecutableContract?: AutoExecutableContract
  setOpenClauseModel: (value: boolean) => void
  fetchContract: () => void
}

const MakePaymentForm: React.FC<MakePaymentFormProps> = ({
  autoExecutableContract,
  setOpenClauseModel,
  fetchContract,
}) => {
  const [name, setName] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [paymentRate, setPaymentRate] = useState<number>(10)
  const [partialPayment, setPartialPayment] = useState<boolean>(false)
  const [addBonus, setAddBonus] = useState<boolean>(false)
  const [addFine, setAddFine] = useState<boolean>(false)
  const [description, setDescription] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [dependencies, setDependencies] = useState<string[]>([])
  const { setLoading } = useAuth()
  const toast = useToast()

  const handleDependenciesChange = (selectedClauseIds: string[]) => {
    if (!autoExecutableContract?.clauses) return
    const selectedClauses = autoExecutableContract.clauses.filter((clause) =>
      selectedClauseIds.includes(clause.id)
    )
    setDependencies(selectedClauses.map((clause) => clause.id))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setOpenClauseModel(false)

    const parameters: MakePaymentData = {
      name,
      amount: amount ? parseFloat(amount) : 0,
      paymentRate,
      partialPayment,
      addBonus,
      addFine,
      description,
      category,
      dependencies,
    }

    const updatedFormData = {
      id: `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      autoExecutableContract: autoExecutableContract
        ? {
            '@assetType': autoExecutableContract['@assetType'],
            '@key': autoExecutableContract['@key'],
          }
        : ({} as AutoExecutableContract),
      description,
      category,
      dependencies,
      parameters,
      actionType: ActionType.Payment.toFixed(1),
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
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Amount</FormLabel>
          <NumberInput>
            <NumberInputField
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Payment Rate: {paymentRate}%</FormLabel>
          <Slider
            value={paymentRate}
            onChange={setPaymentRate}
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
          <Checkbox
            isChecked={partialPayment}
            onChange={(e) => setPartialPayment(e.target.checked)}
          >
            Allow Partial Payment
          </Checkbox>
        </FormControl>

        <FormControl>
          <Checkbox
            isChecked={addBonus}
            onChange={(e) => setAddBonus(e.target.checked)}
          >
            Add Bonus
          </Checkbox>
        </FormControl>

        <FormControl>
          <Checkbox
            isChecked={addFine}
            onChange={(e) => setAddFine(e.target.checked)}
          >
            Add Fine
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

export default MakePaymentForm
