/**
 * Format a number with comma thousand separators
 * @param {number|string} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined || value === 0) {
    return '-'
  }
  
  // Convert to number if it's a string
  const num = typeof value === 'string' ? parseFloat(value) : value
  
  // Format with specified decimal places and add thousand separators
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * Format a currency value (alias for formatNumber with 2 decimal places)
 * @param {number|string} value - The value to format
 * @returns {string} Formatted currency string
 */
export const formatNumberWithDecimals = (value) => formatNumber(value, 2)


export function normalizeNumber(num) {
  return num < 10 ? '0' + num : num.toString()
}