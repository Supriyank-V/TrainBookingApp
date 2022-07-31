import React, { useState } from "react";
import { variables } from "../../api/Variables";
import { useNavigate } from 'react-router-dom'

export const LoginPage = ({ triggered }) => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();
    const [usercheck, setUserCheck] = useState(true);

    const handleSubmit = async e => {
        e.preventDefault();
        fetch(variables.API_URL + `users/login=${userName}&password=${password}`)
            .then(respone => respone.json())
            .then(res => {

                if (res?.length === 0) {
                    alert("Pleae Check: Invalid Login or Password");
                    sessionStorage.removeItem('user')
                    setUserCheck(false);
                }
                if (res?.length === 1) {
                    sessionStorage.setItem('user', JSON.stringify(res))
                    
                    if (triggered) {
                        window.location.reload(false);
                    }
                    else {
                        navigate("/home", { replace: true });
                    }
                }
            })
    }
    return (
        <div className='h-[90%] flex flex-col justify-center items-center bg-[#90ABEE] m-2 rounded-lg'>
            <div className=" max-h-[90%] max-w-[95%] rounded-lg shadow-lg flex flex-col justify-center items-center bg-white">
                <div className="p-10 md:p-16 flex flex-col items-center w-full transition-all duration-500">
                    <h1 className="text-center text-2xl font-bold">
                        Login to you account
                    </h1>
                    <form className="mt-8 w-full">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col justify-center items-center w-full">
                                <input type="text" placeholder="User Name/Login" className={`border w-full m-2 p-2 rounded-md focus:bg-zinc-50 ${usercheck ? 'border-slate-300' : 'border-red-500'}`} 
                                onChange={e => setUserName(e.target.value)} />
                                <input type="password" placeholder="Password" className={`border w-full m-2 p-2 rounded-md focus:bg-zinc-50 ${usercheck ? 'border-slate-300' : 'border-red-500'}`} 
                                onChange={e => setPassword(e.target.value)} />
                            <div/>    
                            <div className="flex flex-col justify-center w-full mt-4">
                                <button className="rounded-md bg-blue-600 px-4 py-1 mt-2 w-full text-white text-lg hover:bg-orange-500 hover:text-white duration-500" type={"button"} onClick={handleSubmit}>Login</button>
                                <button className="rounded-md bg-blue-600 px-4 py-1 mt-2 w-full text-white text-lg hover:bg-orange-500 hover:text-white duration-500" type={"reset"} onClick={()=>setUserCheck(true)} >Clear</button>
                            </div>
                            </div>
                        </div>
                    </form>
                    <h2 className="mt-4">Don't have an account yet ? <a href="/register" className="cursor-pointer font-bold text-black hover:underline"> Sign Up</a></h2>
                </div>
            </div>
        </div>
    )
}
