export const formatObjectEntries = (data: Record<string, any>) => {
  return Object.entries(data)
    .filter(([key]) => key !== '@assetType')
    .map(([key, value]) => {
      const formattedKey = key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (str) => str.toUpperCase())

      let formattedValue

      if (typeof value === 'boolean') {
        formattedValue = value ? 'Yes' : 'No'
      } else if (Array.isArray(value)) {
        formattedValue = value.length
          ? value
              .map((item) =>
                typeof item === 'object'
                  ? JSON.stringify(item, null, 2)
                  : String(item)
              )
              .join(', ')
          : 'Empty List'
      } else if (typeof value === 'object' && value !== null) {
        formattedValue = JSON.stringify(value, null, 2)
      } else if (typeof value === 'number') {
        formattedValue = value.toLocaleString()
      } else {
        formattedValue = String(value)
      }

      return { key: formattedKey, value: formattedValue }
    })
}
