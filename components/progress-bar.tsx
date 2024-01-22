"use client"

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { useTheme } from 'next-themes';


export const ProgressBarPleas = () => {

  const { theme } = useTheme()  
    return (

        <ProgressBar
          height="4px"
          color={theme === 'dark' ? "#cbe8ff" : theme === 'light' ? "#163273" : "#98d1ff" }
          options={{ showSpinner: false }}
          shallowRouting
      />
    )
}