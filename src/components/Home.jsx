import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';
import { CookieContext } from '../context/cookieContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpinnerContext } from '../context/spinnerContext';

export const Home = () => {
  // const uri = 'http://localhost:4002';

  const uri = 'https://expense-tracker-api-u7ew.onrender.com';
  // const uri = 'https://test-api-jflu.onrender.com';

  const [expenses,setExpenses]=useState([]);
  const [amount,setAmount]=useState('');
  const [description,setDescription]=useState('');
  const [categories,setCategories]=useState(['Food','Entertainment','Education','Health','Lend','Transport','Others']);

  // const [toUpdateExpenses,setToUpdateExpenses]=useState([]);
  const [toUpdateAmount,setToUpdateAmount]=useState('');
  const [toUpdateDescription,setToUpdateDescription]=useState('');
  const [toUpdateExpenseId,setToUpdateExpenseId]=useState('');
  const [toUpdateCategory,setToUpdateCategory]=useState(categories[0]);


  const [selectedCategory,setSelectedCategory]=useState(categories[0]);
  const [spinner,setSpinner] = useContext(SpinnerContext)

  const navigate = useNavigate();
  const [encryptedCookieValue,setEncryptedCookieValue]= useState(document.cookie.split('=')[1]);
  
  const updateRef = useRef();

// Tostify related functions  
const showTaskSuccess = () => {
  toast.success("Expense Added !");
};
const showTaskFailure = () => {
  toast.error("Expense Deleted!");
};
function handleCategoryChange(e){
  setSelectedCategory(e.target.value);
}

const showUpdateSuccess = ()=>{
  toast.success("Expense Updated !");
}

  // Get all expneses
  async function getData(){
    setSpinner(true)
      try {
        await axios.get(`${uri}/user/${encryptedCookieValue}`)
        .then(dataa=>setExpenses(dataa.data))
        .then(()=>{
          setSpinner(false)
        })
      } catch (error) {
        console.log(error)
      }
      
  }

  // Add an expense
  async function handleAddExpense(){
    try {
      setSpinner(true)
      await axios.put(`${uri}/addexpense/${encryptedCookieValue}`,{
        "amount":amount,
        "description":description,
        "category":selectedCategory
      }).then(async()=>{
        await getData();
      })
      .then(()=>showTaskSuccess())
      
      setAmount('');
      setDescription('');
      
    } catch (error) {
      console.log(error)
    }
  }
  
  // Delete an expense
  async function deleteExpense(e){
    const taskid=e.target.id;
    try {
      // await axios.put(`${uri}/removeexpense/${encryptedCookieValue}/${taskid}`,{
        setSpinner(false) 
      await axios.put(`${uri}/deleteexpense`,{
        "encryptedCookieValue":encryptedCookieValue,
        "taskid":taskid
      }).then(async()=>{
        await getData();
        setToUpdateAmount('');
        setToUpdateDescription('');
      })
      .then(()=>{
        updateRef.current.classList.add('hidden')
        showTaskFailure()}
      )
    } catch (error) {
      console.log(error)
    }

  }

  // Set Expense to Edit an expense
  async function setExpenseToUpdate(e){
    updateRef.current.classList.remove('hidden')
    const taskid=e.target.id;
    try {
      await axios.get(`${uri}/getexpenese/${encryptedCookieValue}/${taskid}`)
      .then((data)=>{
        setToUpdateAmount(data.data.amount);
        setToUpdateDescription(data.data.description);
        setToUpdateCategory(data.data.category)
        setToUpdateExpenseId(data.data.id)
      })
    } catch (error) {
      console.log(error)
    }

  }
  
  // Send edited expense to server
  async function editExpense(e){
    setSpinner(false);
    try {
      const taskid=e.target.id;
      await axios.put(`${uri}/editexpense/${encryptedCookieValue}/${taskid}`,{
        "amount":toUpdateAmount,
        "description":toUpdateDescription,
        "category":toUpdateCategory
      })
      .then(async ()=>{
        await getData();
      })
      .then(()=>{
        updateRef.current.classList.add('hidden')
        showUpdateSuccess();
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(encryptedCookieValue === undefined){
      setSpinner(false)
      navigate('/login')
    }else{
      getData();
    }
    
  },[])
  return (
    <div className='bg-gray-900 h-screen w-full flex   text-white flex-col  py-7 md:py-14 px-4 md:px-10'>
        <ToastContainer/>
        <div className="flex justify-center  justify-between flex-col md:flex-row md:gap-0 gap-4">

          {/* add expense */}
          <div className='flex flex-col w-full md:w-1/4 text-sm'>

            <div className='flex flex-col my-2'>
              <label htmlFor="amount">Enter Amount</label>
              <input type="number" id='amount' name="amount" value={amount} onChange={(e)=>setAmount(e.target.value)} className="p-2 rounded-lg text-black "/>
            </div>

            <div className='flex flex-col my-2'>
              <label htmlFor="description">Description</label>
              <input type="text" id='description' name="description" value={description} onChange={(e)=>setDescription(e.target.value)} className="p-2 rounded-lg text-black "/>
            </div>

            <div className="flex flex-col my-2">
              <label htmlFor="categories">Select Category For Expense</label>
              <select name="categories" id="categories" className='p-2 text-black rounded-lg' onChange={handleCategoryChange} >
                {
                  categories.map(category=>{
                    return (
                      <option value={category} key={category} className='text-black'>
                        {category}
                      </option>
                    )
                  })
                }
              </select>
            </div>
            <button className='bg-green-700 p-3 rounded-lg font-mono px-4 w-fit  mt-4  min-w-28 flex justify-center items-center shadow-md shadow-black hover:shadow-gray-700 duration-500' data-load={spinner} onClick={handleAddExpense}>
            {
              spinner === false ? 
              "Add Expense"
             :
             <div className="spinner"></div>
            }
            </button>
          </div>

          {/* show expenses */}
          <div className="flex flex-col w-full md:pl-10 items-center md:pt-6">
          <p className='text-2xl my-2 font-semibold text-gray-300'>You'r Expense</p>
          {
            expenses.map(item=>{
              return item.expenses.map(expense=>{
                return(
                  <div className="flex justify-between w-full md:w-1/2 my-1" key={expense.id}>
                    <div className='w-1/3'>
                      <p className="text-base md:text-xl capitalize">{ expense.description}</p>
                      <p className='text-xs'>{expense.category  }</p>
                    </div>
                    <div className=' flex items-end'>
                      <p className='text-xs'>{expense.createdAt.split("T")[0]}</p>
                    </div>
                    <div className='flex items-end'>
                      <p className='mr-2'>&#8377;{expense.amount } </p>
                      <button onClick={setExpenseToUpdate} id={expense.id} className=' text-xl hover:cursor-pointer'>📝</button>

                      
                    </div>
                  </div>
                )
              })
            })
          }
        </div>

        {/* ================Update container==================== */}
        <div className='update-container hidden absolute right-0 top-0 bg-slate-950 pt-24 px-8 w-full md:w-1/3 h-full  shadow-lg shadow-black' ref={updateRef}>
          <div className="flex justify-between">
            <p className='text-xl '>Update expense</p>   
            <button className='text-red-700 ' onClick={(e)=>updateRef.current.classList.add('hidden')}>❌</button>

          </div> 
          <div className='flex flex-col my-2'>
            <label htmlFor="toUpdateAmount">amount</label>
            <input type='number' id='toUpdateAmount' name='toUpdateAmount' value={toUpdateAmount} onChange={(e)=>setToUpdateAmount(e.target.value)} className='p-2 rounded-lg text-black '/>
          </div>  

          <div className='flex flex-col my-2'>
            <label htmlFor="toUpdateDescription">Description</label>
            <input type='text' name='toUpdateDescription'  id="toUpdateDescription" value={toUpdateDescription}  onChange={(e)=>setToUpdateDescription(e.target.value)} className='p-2 rounded-lg text-black '/>
          </div>  
            <div className="flex flex-col my-2">
                <label htmlFor="toUpdateCategories">Select Category For Expense</label>
                <select name="toUpdateCategories" id="toUpdateCategories" className='p-2 text-black rounded-lg' onChange={(e)=>setToUpdateCategory(e.target.value)} value={toUpdateCategory} >
                  {
                    categories.map(category=>{
                      return (
                        <option value={category} key={category} className='text-black'>
                          {category}
                        </option>
                      )
                    })
                  }
                </select>
              </div>
              <div className='flex gap-5'>
                <button onClick={editExpense} id={toUpdateExpenseId} 
                className=' bg-green-700 p-3 rounded-lg font-mono px-4 w-fit  mt-4  min-w-28 flex justify-center items-center hover:bg-red-900 duration-500'>
                   {
                    spinner === false ? 
                    "Update"
                  :
                  <div className="spinner"></div>
                  }
                </button>
                <button onClick={deleteExpense} id={toUpdateExpenseId} 
                className=' bg-red-900 text-white p-3 rounded-lg font-mono px-4 w-fit  mt-4  min-w-28 flex justify-center items-center '>
                   {
                      spinner === false ? 
                      "Delete"
                    :
                    <div className="spinner"></div>
                    }
                </button>
              </div>
              
        </div>
        </div>
        
        
    </div>  
  )
}
