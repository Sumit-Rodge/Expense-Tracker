import React from 'react'
import { useNavigate } from 'react-router';
export const Password = () => {

    const navigate = useNavigate();
  function navigateBack(){
    setTimeout(() => {
        navigate('/login')
    }, 10000);
  }  
  return (
    <div className='bg-gray-900 h-screen w-full flex justify-center text-white items-center overflow-hidden flex-col p-4 md:p-0'>
        <h1 className='font-mono pb-3 text-xl'>No worries, make another one.</h1>
        <a href="https://imgbb.com/"><img  className="rounded-3xl" src="https://i.ibb.co/sy5JhD0/arpit-bala-meme-arpit-bala.gif" alt="arpit-bala-meme-arpit-bala" border="0" /></a>

        {navigateBack()}
    </div>    
  )
}
 