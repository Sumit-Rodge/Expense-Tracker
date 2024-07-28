import React, { useContext, useState } from 'react'
import axios from 'axios';
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { SpinnerContext } from '../context/spinnerContext';


export const Register = () => {

    const navigate = useNavigate();
    const [spinner,setSpinner] = useContext(SpinnerContext)

    const [error,setError]=useState(false);
    const initialValues= {
        firstname:'',
        lastname:'',
        username:'',
        email:'',
        password:''
    };
  const uri = 'http://localhost:4002';

  // const uri = 'https://expense-tracker-api-u7ew.onrender.com';
    // const uri = 'https://test-api-jflu.onrender.com';

    const RegisterSchema = Yup.object().shape({

        firstname : Yup.string().required("Firstname is required").min(3,"First name must be longer than 3 character"),

        lastname : Yup.string().required("Lastname is required").min(3,"Last name must be longer than 3 character"),

        username : Yup.string().min(3,"Username must be longer than 3 character").max(20,"Username is too long").required("Username is required"),

        email: Yup.string().email().required("Email is required"),
      
        password: Yup.string()
          .required("Password is required")
          .min(4, "Password must be longer than 3 character"),
      });

    
    async function sendData(values){
      setSpinner(true)
        try {
            await axios.post(`${uri}/register`,{
                "firstname":values.firstname,
                "lastname":values.lastname,
                "email":values.email,
                "username":values.username,
                "password":values.password
            }).then(()=>setSpinner(false))
            navigate('/login');
        } catch (error) {
            console.log(error);
            setError(true);
        }
    }
  
  return (
    <div className='bg-gray-900 h-screen w-full flex justify-center text-white items-center'>
    <Formik
      initialValues={initialValues}
      validationSchema={RegisterSchema}
      onSubmit={(values)=>{sendData(values)}}
    >
      {(formik) => {
        const { isValid, dirty } = formik;
        return (
          <div className="w-full md:w-1/4 p-4 md:p-0 text-sm">
            <h1 className='text-3xl font-mono text-center'>Register</h1>
            <Form>

              {/* #firstname   */}
              <div className="flex flex-col  my-4">
                <label htmlFor="firstname">First Name</label>
                <Field
                    type="text" 
                    name="firstname" 
                    className="text-black bg-gray-200 p-2 rounded-lg font-mono">
                </Field>
                <ErrorMessage name="firstname" component="span" className="text-red-500"/>
              </div>    

              {/* #lastname   */}
              <div className="flex flex-col my-4">
                <label htmlFor="lastname">Last Name</label>
                <Field
                 type="text"
                 name="lastname"
                 className="p-2 text-black bg-gray-200 rounded-lg font-mono">
                </Field>
                <ErrorMessage name="lastname" component="span" className='text-red-500'/>
              </div>

             {/* username  */}
             <div className="flex flex-col">
                <label htmlFor="username">Username</label>
                <Field
                 type="text"
                 name="username"
                 className="p-2 text-black bg-gray-200 rounded-lg font-mono"
                ></Field> 
                <ErrorMessage name="username" component="span" className="text-red-500"/>
             </div>

             {/* #email */}
              <div className="flex flex-col my-4">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="text-black bg-gray-200 p-2 rounded-lg font-mono"
                />
                <ErrorMessage name="email" component="span" className="text-red-500" />
                {
                    error?<p className='text-red-500'>Email is already in use</p>:""
                }
              </div>

                {/* #password */}
              <div className="flex flex-col my-4">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="text-black bg-gray-200 p-2 rounded-lg  font-mono"
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className="text-red-500"
                />
              </div>
            
            <Link to='/login' className='text-green-700 text-lg hover:text-blue-50'>Already have an account?</Link>
            <div className='flex my-4'>
              <button
                type="submit"
                className={(isValid)?"bg-blue-600 px-6 py-3 mx-auto rounded-lg":'bg-red-600 px-6 py-3 mx-auto rounded-lg'}
                disabled={!(isValid)}
              >
                {
                  spinner === true ?
                  <div className="spinner"></div> :
                   "Sign Up" 
                }
                
              </button>
            </div>
            </Form>
          </div>
        );
      }}
    </Formik>

    </div>
  )
}
