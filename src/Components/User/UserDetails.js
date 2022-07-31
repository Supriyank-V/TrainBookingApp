import React, { useEffect, useState } from "react";
import { LoginPage } from './LoginPage'
import { variables } from '../../api/Variables';
import { useNavigate } from "react-router-dom";

function getSignedInUser() {
  const userDetails = sessionStorage.getItem('user');
  const user = JSON.parse(userDetails);
  return user?.[0]
}

export const UserDetails = () => {
  let navigate = useNavigate();
  const user = getSignedInUser();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [emailId, setEmailId] = useState();
  const [phone, setPhoneNumber] = useState();
  const [address, setAddress] = useState();
  const [nortification, setNortification] = useState();
  
  useEffect(() => {
    const user = getSignedInUser();
    if (user) {
      setFirstName(user.FirstName);
      setLastName(user.LastName);
      setEmailId(user.Email);
      setPhoneNumber(user.Phone);
      setAddress(user.Address);
      setNortification(user.Nortifications);
    }
  }, [])

  if (!user) {
    return <LoginPage triggered={true} />
  }

  let removeUser = async e => {
    e.preventDefault();

    var deleted = await fetch(variables.API_URL+`users/${user.Id}`,{ method:'DELETE'}).then( res => res.json())

    if(deleted === 1)
    {
      fetch(variables.API_URL+`users/delete/email=${emailId}`)
      .then(email => email.json())
      .then(email=> {
        if(email === 1)
        {
          alert("User Deleted and Nortification sent Successfully.")
        }
        else{
          alert("User Deleted Successfully");
        }
        })
      sessionStorage.removeItem('user')
      navigate("/login", { replace: true });
    }
  }

  let handleSubmit = async e => {
    e.preventDefault();

    var data = JSON.stringify({
      Id: user.Id,
      AccessType: 2,
      FirstName: firstName,
      LastName: lastName,
      Login: user.Login,
      Email: emailId,
      PhoneNumber: phone,
      IsNortification: nortification,
      Address: address,
    })

    var res = await fetch(variables.API_URL + "users", {
      method: "PUT",
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: data
    })
    let resJson = await res.json();
    if (resJson === "Updated Successfully") {
      alert("Please Re-Login to view changes")
      navigate("/login", { replace: true });
    }
  }

  const input = `border w-[90%] md:w-[70%] m-2 p-2 rounded-md focus:bg-zinc-50 text-base font-normal bg-clip-padding transition ease-in-out focus:border-blue-600 focus:outline-none`;

  return (
    <div className='h-[90%] flex flex-col justify-center items-center bg-[#90ABEE] m-2 rounded-lg'>
      <div className="bg-white w-[90%] h-[90%] md:max-w-4xl flex flex-col items-center rounded-lg p-6">
        <label className="text-xl md:text-2xl py-2 font-bold">Account Details</label>

        <div className="flex flex-col md:flex-row justify-between w-[70%] mt-4 md:mt-8">
          <label><b>Login ID:</b> {user.Login}</label>
          <label><b>Access Type:</b> {user.Rights}</label>
          <label><b>Nortifications:</b> {user.Nortifications ? "Yes" : "No"}</label>
        </div>

        <hr className="p-[0.5px] w-[90%] mt-4 md:mt-8" />

        <label className="text-xl font-bold mt-4 md:mt-8">Editable Account Details <button><ion-icon name="create-outline"></ion-icon></button></label>
        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full overflow-auto">
          <div className="flex flex-col md:flex-row w-full">

            <div className="md:m-4 flex flex-col md:w-[50%]">
              <div className="flex md:flex-row flex-col w-full justify-between md:mt-4">
                <label className="m-2">First Name</label>
                <input type={"text"} placeholder={user.FirstName} onChange={e => setFirstName(e.target.value)} className={input}></input>
              </div>
              <div className="flex md:flex-row flex-col w-full justify-between md:mt-4">
                <label className="m-2">Last Name</label>
                <input type={"text"} placeholder={user.LastName} onChange={e => setLastName(e.target.value)} className={input}></input>
              </div>
              <div className="flex md:flex-row flex-col w-full justify-between md:mt-4">
                <label className="m-2">Address</label>
                <input type={"text"} className={input} placeholder={user.Address} onChange={e => setAddress(e.target.value)}></input>
              </div>
            </div>

            <div className="md:m-4 flex flex-col md:w-[50%]">
              <div className="flex md:flex-row flex-col w-full justify-between md:mt-4">
                <label className="m-2">Email</label>
                <input type={"text"} placeholder={user.Email} onChange={e => setEmailId(e.target.value)} className={input}></input>
              </div>
              <div className="flex md:flex-row flex-col w-full justify-between md:mt-4">
                <label className="m-2">Phone</label>
                <input type={"text"} placeholder={user.Phone} onChange={e => setPhoneNumber(e.target.value)} className={input}></input>
              </div>
              <div className="flex md:flex-row w-[90%] justify-between md:mt-4">
                <label className="m-2">Enable Nortification:</label>
                <input type={"checkbox"} onChange={e => setNortification(e.target.checked)} className="mt-3" />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row  justify-center my-2">
            <button type={"submit"} className="bg-blue-600 w-full m-2 h-10 rounded-md text-white hover:bg-orange-500 duration-500">Save Details</button>
            <button type={"reset"} className="bg-blue-600 w-full m-2 h-10 rounded-md text-white hover:bg-orange-500 duration-500">Reset Details</button>
            <button type={"button"} className="bg-red-600 w-full m-2 h-10 rounded-md text-white hover:bg-orange-500 duration-500" onClick={(e) => removeUser(e)}>Delete User</button>
          </div>
        </form>
      </div>
    </div>
  )
}