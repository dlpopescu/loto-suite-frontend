const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || value === 0) {
    return '-'
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export const formatNumberWithDecimals = (value) => formatNumber(value, 2)

export const normalizeNumber = (value) => {
  const num = typeof value === 'string' ? parseInt(value) : value
  return num < 10 ? '0' + num : num.toString()
}

export function isFunction(shouldBeFunction) {
    return typeof shouldBeFunction === 'function';
}