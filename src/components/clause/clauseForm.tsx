import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
  Text,
} from '@chakra-ui/react'
import { actionTypeDropdownValues, ActionType } from '../../utils/actionType'
import GetDeductionForm from './getDeductionParams'
import DateAndTimeParams from './dateAndTimeParams'
import GetCreditForm from './getCreditParams'
import MakePaymentForm from './makePaymentParams'
import FinalizeContractInput from './finalizeParams'

interface ClauseFormProps {
  contract?: AutoExecutableContract
  openClauseModel: boolean
  setOpenClauseModel: (value: boolean) => void
  fetchContract: () => void
}

const ClauseForm: React.FC<ClauseFormProps> = ({
  contract,
  openClauseModel,
  setOpenClauseModel,
  fetchContract,
}) => {
  const [clauseType, setClauseType] = useState<ActionType | ''>('')

  return (
    <Modal
      isOpen={openClauseModel}
      onClose={() => setOpenClauseModel(false)}
      size="4xl"
    >
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalHeader>Create Clause</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Clause Type</FormLabel>
            <Text fontSize="sm" color="gray.500" mb={2}>
              Please select the type of clause from the options below.
            </Text>
            <Select
              placeholder="Select Clause Type"
              value={clauseType}
              onChange={(e) =>
                setClauseType(Number(e.target.value) as ActionType)
              }
            >
              {actionTypeDropdownValues.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormControl>

          {clauseType === ActionType.CheckDateInterval && (
            <DateAndTimeParams
              autoExecutableContract={contract}
              setOpenClauseModel={setOpenClauseModel}
              fetchContract={fetchContract}
            />
          )}
          {clauseType === ActionType.GetDeduction && (
            <GetDeductionForm
              autoExecutableContract={contract}
              setOpenClauseModel={setOpenClauseModel}
              fetchContract={fetchContract}
            />
          )}
          {clauseType === ActionType.GetCredit && (
            <GetCreditForm
              autoExecutableContract={contract}
              setOpenClauseModel={setOpenClauseModel}
              fetchContract={fetchContract}
            />
          )}
          {clauseType === ActionType.Payment && (
            <MakePaymentForm
              autoExecutableContract={contract}
              setOpenClauseModel={setOpenClauseModel}
              fetchContract={fetchContract}
            />
          )}
          {clauseType === ActionType.FinishContract && (
            <FinalizeContractInput
              autoExecutableContract={contract}
              setOpenClauseModel={setOpenClauseModel}
              fetchContract={fetchContract}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ClauseForm
