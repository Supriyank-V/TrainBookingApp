import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { variables } from '../../api/Variables';

export const RegisterPage = () => {
  let navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    Id: 1,
    AccessType: 2,
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: 0,
    Login: '',
    IsNortification: true,
    Address: '',
    Password: ''
  })

  const [check , setCheck] = useState({
    FirstName: true,
    LastName: true,
    Email: true,
    PhoneNumber: true,
    Login: true,
    Address: true,
    Password: true
  })

  const validationCheck = () => {
    if(registerData.FirstName === "") setCheck(data=> ({...data,FirstName:false}))
    if(registerData.LastName === "") setCheck(data=> ({...data,LastName:false}))   
    if(registerData.Email === "") setCheck(data=> ({...data,Email:false}))
    if(registerData.PhoneNumber === 0) setCheck(data=> ({...data,PhoneNumber:false}))
    if(registerData.Login === "") setCheck(data=> ({...data,Login:false}))
    if(registerData.Password === "") setCheck(data=> ({...data,Password:false}))
    if(registerData.Address === "") setCheck(data=> ({...data,Address:false}))
  }

  const registerChanges = e => {
    const { name, value } = e.target;
    let dataField = value

    if (name === "IsNortification") {
      dataField = e.target.checked;
    }
    setRegisterData(data => ({
      ...data,
      [name]: dataField
    }));
    setCheck(data =>({
      ...data,
      [name]: true
    }))
  };

  let handleSubmit = async e => {
    e.preventDefault();
    if (registerData.FirstName === "" || registerData.LastName === "" || registerData.Email === "" || registerData.PhoneNumber === 0 || registerData.Login === "" ||
      registerData.Password === "" || registerData.Address === "") {
      validationCheck()  
      alert("Please Enter the Missing Fields")
    }
    else {
      var res = await fetch(variables.API_URL + "users", {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(registerData),
      });
      let resJson = await res.json();
      if(resJson === 1)
      {
          alert("Registered Successfully, Please proceed to Login.")
          navigate("/login", { replace: true });
      }
      else if(resJson === -2)
      {
        alert("Login Already Exists, Please try a different Login.")
      }
       else{
        alert("Please try after sometime or Contact the Admin for details.")
       }   
    }
  }

  const input = `border w-full m-2 p-2 rounded-md focus:bg-zinc-50 text-base font-normal bg-clip-padding transition ease-in-out focus:border-blue-600 focus:outline-none`;

  return (
    <div className='h-[90%] flex flex-col justify-center items-center bg-[#90ABEE] m-2 rounded-lg'>
      <div className="flex flex-col justify-center items-center w-[90%] md:max-w-2xl h-[90%] md:h-[70%]">
        <div className="bg-white w-full h-full rounded-lg overflow-auto">
          <div className="p-4 md:p-8 flex flex-col justify-center items-center">
            <h1 className="text-xl md:text-2xl py-4">
                <b>Enter Details for Sign up</b>
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col mt-4 w-[90%]" >
              <div className="flex flex-col md:flex-row justify-center items-center w-full mb-4">
                <div className="flex flex-col w-full md:pr-2">

                  <input type={"text"} name="FirstName" placeholder='First Name' onChange={registerChanges} className={`${check.FirstName? 'bg-white':'bg-red-50 border-red-500'} ${input}`} />
                  <input type={"text"} name="LastName" placeholder='Last Name' onChange={registerChanges} className={`${check.LastName? 'bg-white':'bg-red-50 border-red-500'} ${input}`} />
                  <input type={"email"} name="Email" placeholder='Email ID' onChange={registerChanges} className={`${check.Email? 'bg-white':'bg-red-50 border-red-500'} ${input}`} />
                  <input type={"tel"} name="PhoneNumber" placeholder='Phone Number' onChange={registerChanges} className={`${check.PhoneNumber? 'bg-white':'bg-red-50 border-red-500'} ${input}`} />
                </div>
                <div className="flex flex-col w-full md:pl-2">

                  <input type={"text"} name="Login" placeholder='User Name/Login' onChange={registerChanges} className={`${check.Login? 'bg-white':'bg-red-50 border-red-500'} ${input}`} />
                  <input type={"password"} name="Password" placeholder='Password' onChange={registerChanges} className={`${check.Password? 'bg-white':'bg-red-50 border-red-500'} ${input}`} />
                  <input type={"text"} name="Address" placeholder='Address' onChange={registerChanges} className={`${check.Address? 'bg-white':'bg-red-50 border-red-500'} ${input}`} />

                  <div className="flex flex-row justify-between">
                    <label className="w-[80%] m-2 p-2">Enable Nortification:</label>
                    <input type={"checkbox"} name="IsNortification" onChange={registerChanges}/>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between w-full">
                <button type={"submit"} className="bg-blue-600 w-full m-2 h-10  rounded-md text-white hover:bg-orange-500 duration-500">SUBMIT</button>
                <button type={"reset"} className="bg-blue-600 w-full m-2 h-10 rounded-md text-white hover:bg-orange-500 duration-500">RESET</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}
