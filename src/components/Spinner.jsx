import React, { useContext } from 'react'
import { SpinnerContext } from '../context/spinnerContext'


export const Spinner = () => {
    const [spinner,setSpinner] = useContext(SpinnerContext)  
  return (
    <div className={spinner === true ? "spinner-enabled spinner-parent flex flex-col" : "spinner-disabled"} >
        <p className='text-white pb-4 font-mono'>Loading, please wait...</p>
        <div className="spinner"></div>
    </div>
  )
}
