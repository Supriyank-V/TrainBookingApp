import React, { useEffect, useState } from "react";
import { LoginPage } from '../User/LoginPage'
import { variables } from "../../api/Variables";
import { PopupWindow } from "../PopupWindow";

function getUserInfo() {
  const userString = sessionStorage.getItem('user');
  const user = JSON.parse(userString);
  return user?.[0]
}

export const BookingHistoryPage = () => {

  const user = getUserInfo();
  const [booking, setBookings] = useState([]);
  const [current, setCurrent] = useState(true);
  const [detailsPanel, setDetailsPanel] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [bookingDetails, setBookingDetails] = useState([]);

  const openDetails = (bookingId) => {
    setBookingId(bookingId);
    if(current === true){
      fetch(variables.API_URL + `bookings/bookingId=${bookingId}&userId=${user.Id}`)
      .then(res => res.json())
      .then(res=>{
        setBookingDetails(res);
      })
    }
    else{
      fetch(variables.API_URL + `bookings/previous/bookingId=${bookingId}&userId=${user.Id}`)
      .then(res => res.json())
      .then(res=>{
        setBookingDetails(res);
      })
    }
    setDetailsPanel(true)
  }

  const cancelBooking = async (bookingId) =>{
    var result = await fetch(variables.API_URL + `bookings/delete/${bookingId}`,{method:'DELETE'}).then(result => result.json());

    if(result === 1){
      var sending = await fetch(variables.API_URL + `bookings/delete/email=${user.Email}&bookingId=${bookingId}&userName=${user.FirstName}`).then(sending => sending.json());
      if(sending === 1){
        alert("Booking Cancelled and Nortified successfully.");
      }
      else{
        alert("Booking Cancelled")
      }
      window.location.reload(false);
    }
    else{
      alert("Cancel Failed. Please try after some time.")
    }
     
  }

  const refreshList = () => {
    setCurrent(true)
    fetch(variables.API_URL + `bookings/${user.Id}`)
      .then(respone => respone.json())
      .then(res => {
        setBookings(res);
      })
  }

  const refreshPreviousList = () => {
    setCurrent(false)
    fetch(variables.API_URL + `bookings/previous/${user.Id}`)
      .then(respone => respone.json())
      .then(res => {
        setBookings(res);
      })
  }

  useEffect(() => {
    if (user) {
      refreshList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) {
    return <LoginPage triggered={true} />
  }

  return (
    <div className='h-[90%] flex flex-col justify-center items-center bg-[#90ABEE] m-2 rounded-lg'>
      <div className="flex flex-col justify-center items-center w-[90%] h-[90%] bg-white rounded-lg">
        <label className="text-2xl font-bold mt-8 text-center w-[90%]">Booking History</label>
        <div className="flex flex-row mt-6">
          <div className="md:pr-4">
            <input type="radio" id="current" name="bookings" defaultChecked={true} onClick={refreshList} />
            <label className={`pl-1 ${current ? 'font-bold' : ''}`}>Current Bookings</label>
          </div>
          <div className="pl-4">
            <input type="radio" id="past" name="bookings" onClick={refreshPreviousList} />
            <label className={`pl-1 ${current ? '' : 'font-bold'}`}>Past Bookings</label>
          </div>
        </div>
        <hr className="my-4 w-[90%]" />

        <div className="w-full h-[100vh] overflow-auto">
          <div className="flex flex-col justify-center items-center pb-2">
            {booking?.map(x => (
              <div key={x.BookingId} className="w-[90%] lg:w-[80%] bg-gray-200 my-2 rounded-md p-2 duration-500 shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="w-full md:w-[32%] flex flex-col items-start pl-4">
                    <label><b>Booking ID :</b> {x.BookingId}</label>
                    <label><b>Booking On : </b> {x.BookedOn}</label>
                    <label><b>Train Name : </b> {x.TrainName}</label>
                    <label><b>Train ID : </b>{x.SubTrainId}</label>
                  </div>
                  <div className="w-full md:w-[38%] flex flex-col items-start pl-4">
                    <label><b>Departure : </b>{x.Initial}({x.DateOfDeparture})</label>
                    <label><b>Time of Departure :</b> {x.DepartureTime}</label>
                    <label><b>Arrival : </b> {x.Destination}({x.DateOfArrival})</label>
                    <label><b>Time of Arrival :  </b>{x.ArrivalTime}</label>
                  </div>
                  <div className="w-full md:w-[30%] flex flex-col items-start pl-4">
                    <label><b>Class Category : </b> {x.SeatsCoach}</label>
                    <label><b>Confirmed : </b> {x.Status ? "Yes" : "WL"}</label>
                    <label><b>Seats Booked : </b> {x.NoOfSeats}</label>
                    {current ?
                      <div className="flex flex-col md:flex-row justify-between items-center w-full md:w-[90%]">
                        <button id="curMore" className="rounded-md bg-blue-600 py-1 px-1 w-[90%] mt-2 md:mt-0 md:w-[47%] text-white text-xs  hover:bg-orange-500 hover:text-white duration-500" onClick={() => openDetails(x.BookingId)}>More Details</button>
                        <button id="cancel" className="rounded-md bg-blue-600 py-1 px-1 w-[90%] my-2 md:my-0 md:w-[47%] text-white text-xs  hover:bg-orange-500 hover:text-white duration-500" onClick={() => cancelBooking(x.BookingId)}>Cancel Ticket</button>
                      </div>
                      :
                      <div className="flex flex-col md:flex-row items-center w-[90%]">
                        <button id="prevMore" className="rounded-md bg-blue-600 py-1 w-full mt-2 text-white text-xs  hover:bg-orange-500 hover:text-white duration-500" onClick={() => openDetails(x.BookingId)}>More Details</button>
                      </div>
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
          <PopupWindow trigger={detailsPanel} setTrigger={setDetailsPanel}>
            <label className="my-2 text-lg font-bold">Booking Details for Booking ID : {bookingId}</label>
            <hr/>
            <div className="mt-3 flex flex-col overflow-auto">
              <label className="pb-2 text-sm font-medium">Passenger List</label>
              <table className="overflow-auto rounded-lg">
                <thead className="text-xs text-gray-700 bg-gray-200 uppercase whitespace-nowrap overflow-auto" >
                  <tr>
                    <th className="px-1 py-1 border border-gray-300">Passenger Name</th>
                    <th className="px-1 py-1 border border-gray-300">Age</th>
                    <th className="px-1 py-1 border border-gray-300">Gender</th>
                    <th className="px-1 py-1 border border-gray-300">Phone Number</th>
                    <th className="px-1 py-1 border border-gray-300">Email ID</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingDetails?.map(x=>(
                    <tr key={x.Id} className="text-xs text-left whitespace-nowrap">
                        <th className="px-1 py-1 border border-gray-300 font-medium">{x.PassengerName}</th>
                        <th className="px-1 py-1 border border-gray-300 font-medium">{x.Age}</th>
                        <th className="px-1 py-1 border border-gray-300 font-medium">{x.Gender}</th>
                        <th className="px-1 py-1 border border-gray-300 font-medium">{x.PhoneNumber}</th>
                        <th className="px-1 py-1 border border-gray-300 font-medium">{x.Email}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
              <label className="text-xs pt-2">Meal Preference: {bookingDetails[0]?.MealPreference}</label>
              <label className="text-xs py-2">Payment Method Used: {bookingDetails[0]?.PaymentMethod}</label>
              <hr/>
              <label className="text-lg font-bold pb-4">Total Fare: {bookingDetails[0]?.Fare}</label>
            </div>
          </PopupWindow>
        </div>
      </div>
    </div>
  )
}
