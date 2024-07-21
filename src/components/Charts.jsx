
import React, { useContext, useEffect, useState } from 'react'
import { CookieContext } from '../context/cookieContext';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export const Charts = () => {
  const uri = 'http://localhost:4002';
  const [encryptedCookieValue,setEncryptedCookieValue] = useContext(CookieContext);
  const [expenses,setExpenses]=useState([]);
  const [expenseCategory,setExpenseCategory]=useState([]);
  let cat=[];
  const categoryObj={};
  // const [data,setData] = useState({})

  async function getData(){
    try {
      const temp = await axios.get(`${uri}/user/${encryptedCookieValue}`);
      setExpenses(temp.data[0].expenses);
      // console.log(expenses)
      // .then(dataa=>setExpenses(dataa.data[0].expenses));
    } catch (error) {
      console.log(error) 
    }
}

  function getCategory(){
    expenses.map(exp=>{
       if(categoryObj[exp.category]){
        categoryObj[exp.category]++;
       }else{
        categoryObj[exp.category]=1;
       } 
    })

  }
 
  
  
useEffect(()=>{  
  getData();
  getCategory();

  setExpenseCategory({
    labels:[ ...Object.keys(categoryObj)],
    datasets: [
      {
        data: [...Object.values(categoryObj)]
      } 
    ]
  })

},[])   
  return (   
    <div className='w-1/4'> 
      hii

      
      {expenseCategory!=[]? <Pie  data={expenseCategory}/>:'not datat'}
        <Pie  data={expenseCategory}/>
      {
        console.log(expenseCategory)
      }
  
           
    </div>    
  )
}     
    