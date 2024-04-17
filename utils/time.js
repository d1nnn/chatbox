export const ConvertDateToString = (date) => {
  return date.toLocaleString('en-GB', { timeZone: 'UTC' })
}
