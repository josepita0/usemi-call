export const handleOnlyNumbers = (event:any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault()
    }
  }
  
  export const handleOnlyNumbersAndDot = (event:any) => {
    if (!/[0-9.]/.test(event.key)) {
      event.preventDefault()
    }
  }
  
  export const handleOnlyLetters = (event:any) => {
    if (!/[a-zA-Z ]/.test(event.key)) {
      event.preventDefault()
    }
  }
  
  export const handleOnlyLettersAndNumbers = (event:any) => {
    if (!/[a-zA-Z-0-9]/.test(event.key)) {
      event.preventDefault()
    }
  }
  