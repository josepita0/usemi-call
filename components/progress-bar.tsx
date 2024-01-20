'use client'

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';


export const ProgressBarPleas = () => {
    return (

        <ProgressBar
        height="4px"
        color="#cbe8ff"
        options={{ showSpinner: false }}
        // shallowRouting
      />
    )
}