export function getTimeLeft(dateStr?: string): string {
  if (!dateStr) {
    return 'none'
  }

  const now = new Date()
  const targetDate = new Date(dateStr)

  if (targetDate < now) {
    return 'expired'
  }

  const diffInMillis = targetDate.getTime() - now.getTime()

  const days = Math.floor(diffInMillis / (1000 * 60 * 60 * 24))
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  if (years > 0) {
    const remainingMonths = months % 12
    return (
      years +
      (years === 1 ? ' year' : ' years') +
      (remainingMonths > 0
        ? ` ${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`
        : '')
    )
  }

  if (months > 0) {
    const remainingDays = days % 30
    return (
      months +
      (months === 1 ? ' month' : ' months') +
      (remainingDays > 0
        ? ` ${remainingDays} day${remainingDays === 1 ? '' : 's'}`
        : '')
    )
  }

  if (days > 0) {
    return days + (days === 1 ? ' day' : ' days')
  }

  return 'less than a day'
}
