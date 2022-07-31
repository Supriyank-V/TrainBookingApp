import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {HomePage} from './Components/HomePage'
import {LoginPage} from './Components/User/LoginPage'
import {RegisterPage} from './Components/User/RegisterPage'
import {UserDetails} from './Components/User/UserDetails'
import {FindTrains} from './Components/Train/FindTrains'
import {TrainResult} from './Components/Train/TrainsResult'
import {BookingPage} from './Components/Booking/BookingPage'
import {BookingHistoryPage} from './Components/Booking/BookingHistoryPage'
import { Navbar } from './Components/Navbar';

const App = () => {
  return (
    <div className='h-[100vh]'>
    <BrowserRouter>
    <Navbar/>
    <Routes>
          <Route exact path='/home' element={<HomePage/>} />
          <Route exact path='/login' element={<LoginPage/>} />
          <Route exact path='/register' element={<RegisterPage/>}/>
          <Route exact path='/userdetails' element={<UserDetails/>} />
          <Route exact path='/findtrains' element={<FindTrains/>}/>
          <Route exact path='/trains' element={<TrainResult/>} />
          <Route exact path='/booking' element={<BookingPage/>}/>
          <Route exact path='/bookinghistory' element={<BookingHistoryPage/>}/>
          <Route exact path='/' element={<HomePage />} />
    </Routes>
  </BrowserRouter>
  </div>
  );
}

export default App;
