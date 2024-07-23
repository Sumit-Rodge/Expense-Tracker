import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { CookieContext } from '../context/cookieContext'

export const Header = () => {

  const [encryptedCookieValue,setEncryptedCookieValue] = useContext(CookieContext);

  function deleteCookie(){
    const cookie = document.cookie
    document.cookie=cookie+";max-age=0";
    setEncryptedCookieValue(document.cookie.split('=')[1])
  }

  return (
    <div className='pl-4 h-12 flex items-center *:px-2 bg-gray-500  text-white font-mono text-xs relative z-10'>
      <Link to='/' className='underline underline-offset-8  p-1 rounded-lg w-fit hover:text-red-600'>
            Home  
        </Link>
      {
        (!encryptedCookieValue)?
        <Link to='/login'>Login</Link>:
        <Link to='/login' className='underline underline-offset-8  p-1 rounded-lg w-fit hover:text-red-600' onClick={deleteCookie}>
            Log-Out  
        </Link>
        
      }
      {/* <Link to='/charts' >Charts</Link>   */}
        
    </div>
  )
}
