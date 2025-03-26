import { useState } from 'react'
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Fade,
  RadioGroup,
  Radio,
  Select,
  Stack,
} from '@chakra-ui/react'
import { useAuth } from '../../context/Authcontext'
import { ClauseService } from '../../services/clause'
import { ActionType } from '../../utils/actionType'
import { useToast } from '@chakra-ui/react'

interface FinalizeClauseProps {
  autoExecutableContract?: AutoExecutableContract
  setOpenClauseModel: (value: boolean) => void
  fetchContract: () => void
}

interface FinalizeClauseParameters {
  cancellationCheckValue: {
    tag: string
    referenceValue: string
    dataType: string
    conditionalCheck: string
  }
  autoFinalizationValue: {
    tag: string
    referenceValue: string
    dataType: string
    conditionalCheck: string
  }
}

const FinalizeClauseForm: React.FC<FinalizeClauseProps> = ({
  autoExecutableContract,
  setOpenClauseModel,
  fetchContract,
}) => {
  const [step, setStep] = useState(0)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const [forceCancellation, setForceCancellation] = useState<boolean | null>(
    null
  )
  const [requestedCancellation, setRequestedCancellation] = useState<
    boolean | null
  >(null)
  const [cancellationCheckValue, setCancellationCheckValue] = useState<
    FinalizeClauseParameters['cancellationCheckValue']
  >({
    tag: '',
    referenceValue: '',
    dataType: '',
    conditionalCheck: '',
  })

  const [autoFinalizationValue, setAutoFinalizationValue] = useState<
    FinalizeClauseParameters['autoFinalizationValue']
  >({
    tag: '',
    referenceValue: '',
    dataType: '',
    conditionalCheck: '',
  })

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
    actionType: ActionType.FinishContract.toFixed(1),
  })

  const { setLoading } = useAuth()
  const toast = useToast()

  const handleSubmit = async () => {
    setLoading(true)
    setOpenClauseModel(false)
    const parameters = {
      forceCancellation: forceCancellation || false,
      requestedCancellation: requestedCancellation || false,
      cancellationCheckValue: cancellationCheckValue || undefined,
      autoFinalizationValue: autoFinalizationValue || undefined,
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

  return (
    <Box py={4}>
      <VStack spacing={4} align="stretch">
        {step === 0 && (
          <FormControl p={4}>
            <FormLabel fontWeight="bold">
              Do you want to force finish the contract?
            </FormLabel>
            <RadioGroup>
              <Stack direction="row" spacing={4}>
                <Radio
                  value="yes"
                  onClick={() => {
                    setForceCancellation(true)
                    setStep(1)
                  }}
                >
                  Yes
                </Radio>
                <Radio
                  value="no"
                  onClick={() => {
                    setForceCancellation(false)
                    setStep(2)
                  }}
                >
                  No
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        )}

        {step === 1 && (
          <Fade in>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Category</FormLabel>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" size={'sm'} onClick={handleSubmit}>
              Submit
            </Button>
          </Fade>
        )}

        {step === 2 && (
          <Fade in={isVisible}>
            <FormControl p={4}>
              <FormLabel fontWeight="bold">
                Do you want to request finishing the contract?
              </FormLabel>
              <RadioGroup>
                <Stack direction="row" spacing={4}>
                  <Radio
                    value="yes"
                    onClick={() => {
                      setStep(3)
                      setIsVisible(false)
                      setRequestedCancellation(true)
                    }}
                  >
                    Yes
                  </Radio>
                  <Radio
                    value="no"
                    onClick={() => {
                      setStep(4)
                      setIsVisible(false)
                      setRequestedCancellation(false)
                    }}
                  >
                    No
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Fade>
        )}

        {step === 3 && (
          <Fade in>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </FormControl>

            <Stack my={4} spacing={4}>
              <FormControl>
                <FormLabel>Cancellation Check Value</FormLabel>
                <Input
                  placeholder="Tag"
                  onChange={(e) =>
                    setCancellationCheckValue({
                      ...cancellationCheckValue,
                      tag: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl>
                <Input
                  placeholder="Reference Value"
                  onChange={(e) =>
                    setCancellationCheckValue({
                      ...cancellationCheckValue,
                      referenceValue: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl>
                <Select
                  placeholder="Data Type"
                  onChange={(e) =>
                    setCancellationCheckValue({
                      ...cancellationCheckValue,
                      dataType: e.target.value,
                    })
                  }
                >
                  <option value="int">Integer</option>
                  <option value="float">Float</option>
                  <option value="string">String</option>
                  <option value="bool">Boolean</option>
                  <option value="date">Date</option>
                </Select>
              </FormControl>

              <FormControl>
                <Select
                  placeholder="Conditional Check"
                  onChange={(e) =>
                    setCancellationCheckValue({
                      ...cancellationCheckValue,
                      conditionalCheck: e.target.value,
                    })
                  }
                >
                  <option value="equal">Equal</option>
                  <option value="notEqual">Not Equal</option>
                  <option value="greater">Greater</option>
                  <option value="smaller">Smaller</option>
                </Select>
              </FormControl>
            </Stack>

            <Button colorScheme="blue" size={'sm'} onClick={handleSubmit}>
              Submit
            </Button>
          </Fade>
        )}

        {step === 4 && (
          <Fade in>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </FormControl>

            <Stack my={4} spacing={4}>
              <FormControl>
                <FormLabel>Auto Finalization Value</FormLabel>
                <Input
                  placeholder="Tag"
                  onChange={(e) =>
                    setAutoFinalizationValue({
                      ...autoFinalizationValue,
                      tag: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl>
                <Input
                  placeholder="Reference Value"
                  onChange={(e) =>
                    setAutoFinalizationValue({
                      ...autoFinalizationValue,
                      referenceValue: e.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl>
                <Select
                  placeholder="Data Type"
                  onChange={(e) =>
                    setAutoFinalizationValue({
                      ...autoFinalizationValue,
                      dataType: e.target.value,
                    })
                  }
                >
                  <option value="int">Integer</option>
                  <option value="float">Float</option>
                  <option value="string">String</option>
                  <option value="bool">Boolean</option>
                  <option value="date">Date</option>
                </Select>
              </FormControl>

              <FormControl>
                <Select
                  placeholder="Conditional Check"
                  onChange={(e) =>
                    setAutoFinalizationValue({
                      ...autoFinalizationValue,
                      conditionalCheck: e.target.value,
                    })
                  }
                >
                  <option value="equal">Equal</option>
                  <option value="notEqual">Not Equal</option>
                  <option value="greater">Greater</option>
                  <option value="smaller">Smaller</option>
                </Select>
              </FormControl>
            </Stack>

            <Button colorScheme="blue" size={'sm'} onClick={handleSubmit}>
              Submit
            </Button>
          </Fade>
        )}
      </VStack>
    </Box>
  )
}

export default FinalizeClauseForm
