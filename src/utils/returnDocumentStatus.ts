export const returnDocumentStatus = (status: number) => {
  switch (status) {
    case 0:
      return 'Waiting'
    case 1:
      return 'Cancelled'
    case 2:
      return 'Expired'
    case 3:
      return 'Finalized'
    case 4:
      return 'Partially Signed'
    default:
      return 'Unknown'
  }
}
