export enum ActionType {
  CheckDateInterval = 0,
  GetDeduction,
  GetCredit,
  Payment,
  FinishContract,
  NonExecutable = -1,
}

export const actionTypeDropdownValues: { label: string; value: ActionType }[] =
  [
    { label: 'Check Date Interval', value: ActionType.CheckDateInterval },
    { label: 'Get Deduction', value: ActionType.GetDeduction },
    { label: 'Get Credit', value: ActionType.GetCredit },
    { label: 'Payment', value: ActionType.Payment },
    { label: 'Finish Contract', value: ActionType.FinishContract },
  ]

/**
 * Utility function to get the label of an ActionType value.
 * @param value ActionType
 * @returns string label
 */
export const getActionTypeLabel = (value: ActionType): string => {
  const item = actionTypeDropdownValues.find((item) => item.value === value)
  return item ? item.label : 'Unknown'
}
