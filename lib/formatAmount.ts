export function formatAmount(amount: number, decimal = 2): string {
    const number = Number(amount)
  
    // Separate the integer and decimal parts
    const [integerPart, decimalPart] = number?.toFixed(decimal).split('.')
  
    // Add commas to separate thousands in the integer part
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
    // Combine the formatted integer and decimal parts with a comma as the decimal separator
    const formattedAmount = `${formattedIntegerPart},${decimalPart}`
  
    return formattedAmount
  }
