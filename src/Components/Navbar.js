import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function getUserInfo(){
    const tokenString = sessionStorage.getItem('user');
    const user = JSON.parse(tokenString);
    return user?.[0].FirstName
}

export const Navbar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const user = getUserInfo()

    const logout = () => {
        sessionStorage.removeItem('user')
        setOpen(false)
        navigate("/home", { replace: true });
    }

    return (
        <div className='h-[8%] bg-white'>
            <div className='w-full fixed top-0 left-0 md:flex items-center justify-between bg-white md:px-10 px-7'>
                <div className={`font-bold md:text-2xl text-xl cursor-pointer flex items-center text-black py-4`} onClick={()=>navigate("/home", { replace: true })}>
                    <ion-icon name="train-sharp"></ion-icon>
                    <h1>Train Booking App</h1>
                </div>
                <div className='text-3xl absolute right-8 top-4 cursor-pointer lg:hidden text-black' onClick={() => setOpen(!open)}>
                    <ion-icon name={!open ? "menu-sharp" : "close-sharp"}></ion-icon>
                </div>
                <ul className={`lg:flex lg:items-center absolute lg:static bg-white z-10 lg:z-auto left-0 w-full lg:w-auto lg:pl-0 pl-7 transition-all duration-500 ease-in ${open ? 'top-14 opacity-100' : 'top-[-490px]'}`}>
                    <li className='lg:my-0 my-5'><NavLink className="lg:ml-6 text-md md:text-lg text-black hover:text-gray-400 duration-500" onClick={() => setOpen(false)} to="/home">HOME</NavLink></li>
                    <li className='lg:my-0 my-5'><NavLink className="lg:ml-6 text-md md:text-lg text-black hover:text-gray-400 duration-500" onClick={() => setOpen(false)} to="/findtrains">FIND TRAINS</NavLink></li>
                    <li className='lg:my-0 my-5'><NavLink className="lg:ml-6 text-md md:text-lg text-black hover:text-gray-400 duration-500" onClick={() => setOpen(false)} to="/bookinghistory">BOOKING HISTORY</NavLink></li>
                    <li className='lg:my-0 my-5'><NavLink className="lg:ml-6 text-md md:text-lg text-black hover:text-gray-400 duration-500" onClick={() => setOpen(false)} to="/userdetails">ACCOUNT</NavLink></li>
                    {user ?
                    <li className='lg:my-0 my-5'><NavLink className="rounded-sm bg-blue-600 p-2 text-white lg:ml-8 text-md md:text-lg hover:bg-orange-500 hover:text-white duration-500" onClick={logout} to="/home">LOGOUT, {user}</NavLink></li>
                    :
                    <li className='lg:my-0 my-5'><NavLink className="rounded-sm bg-blue-600 p-2 text-white lg:ml-8 text-md md:text-lg hover:bg-orange-500 hover:text-white duration-500" onClick={() => setOpen(false)} to="/login">LOG-IN/SIGN-UP</NavLink></li>
                    }
                </ul>
            </div>
        </div>
    )
}
