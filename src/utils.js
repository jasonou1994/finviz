import moment from 'moment'

export const formatMilliseconds = milli => moment(milli).format('MMM Do, YYYY')

export const formatNumberAsDollars = number =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number)

export const parseSSEFields = rawString => {
  return (
    rawString
      // since the string is multi line, each for a different field, split by line
      .split('\n')
      // remove empty lines
      .filter(field => field !== '')
      // massage fields so they can be parsed into JSON
      .map(field => {
        const fieldColonSplit = field
          .replace(/:/, '&&&&&&&&')
          .split('&&&&&&&&')
          .map(kv => kv.trim())

        const fieldObj = {
          [fieldColonSplit[0]]: fieldColonSplit[1],
        }
        return fieldObj
      })
      .reduce((acc, cur) => {
        // handles if there are multiple fields of the same type, for example two data fields.
        const key = Object.keys(cur)[0]
        if (acc[key]) {
          acc[key] = `${acc[key]}\n${cur[key]}`
        } else {
          acc[key] = cur[key]
        }
        return acc
      }, {})
  )
}
