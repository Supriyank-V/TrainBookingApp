import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import { variables } from "../../api/Variables";
import { LoginPage } from "../User/LoginPage";
import { TableRows } from "./PassengerData"

function getSignedInUser() {
    const userDetails = sessionStorage.getItem('user');
    const user = JSON.parse(userDetails);
    return user?.[0]
}

export const BookingPage = () => {

    let navigate = useNavigate();
    const user = getSignedInUser();
    const { state } = useLocation();
    const [trainDetails, setDetails] = useState([]);
    const [rowData, setRowsData] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState();
    const [mealPref, setMealPref] = useState();
    const [coach, setCoach] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState();
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [baseFare, setBaseFare] = useState(0);
    const [ack, setAck] = useState(false);
    const [wrow,setWRow] = useState(true);
    const [wpay,setWPay] = useState(true);
    const [wmeal,setWMeal] = useState(true);
    const [wclass,setWClass] = useState(true);

    const clear = () => {
        setWPay(true);
        setWMeal(true);
        setWClass(true);
        setWRow(true);
    }

    const addTableRows = () => {
        if (rowData?.length < 5) {
            const rowInput = {
                Name: '',
                Age: '',
                Gender: '',
                PhoneNumber: '',
                Email: ''
            }
            setRowsData([...rowData, rowInput])
        }
        else {
            alert("Maximum of 5 Person can be booked in one booking.")
        }
    }

    useEffect(() => {
        setPaymentAmount(rowData.length * baseFare);
    }, [rowData, baseFare])

    const optionChanges = (event) => {
        setSelectedCoach(coach.filter(x => x.CoachName === event.target.value));
    }

    useEffect(() => {
        if (selectedCoach === undefined) {
            setBaseFare(0)
        }
        else {
            setBaseFare(selectedCoach[0].Fare);
        }
    }, [selectedCoach])

    const coachDetails = (selectedId) => {
        if (selectedId !== undefined) {
            fetch(variables.API_URL + `trains/coaches/${selectedId}`)
                .then(res => res.json())
                .then(data => {
                    setCoach(data)
                })
        }
    }

    const deleteTableRows = (index) => {
        const rows = [...rowData];
        rows.splice(index, 1);
        setRowsData(rows)
    }

    const handleChange = (index, evnt) => {
        const { name, value } = evnt.target;
        const rowsInput = [...rowData];
        rowsInput[index][name] = value;
        setRowsData(rowsInput);
    }

    useEffect(() => {
        if (state !== null) {
            setDetails(state.train);
            coachDetails(state.train.IdSubTrain)
        }
        else {
            alert("Select Train First");
            navigate("/findtrains", { replace: true });
        }
        // eslint-disable-next-line
    }, [])

    if (!user) {
        return <LoginPage triggered={true} />
      }    

    const handleSubmit = async e => {
        e.preventDefault();
        if(!ack){
            alert("Please confirm the details before booking")
        }
        else if(selectedCoach === undefined || mealPref === undefined || paymentMethod === undefined || rowData.length === 0){
            if(selectedCoach === undefined) setWClass(false);
            if(mealPref === undefined) setWMeal(false);
            if(paymentMethod === undefined) setWPay(false);
            if(rowData.length === 0) setWRow(false);
            alert("Please Check Missing Details");
        }
        else{

            const data = {
                IdTrain: trainDetails.IdTrain,
                TrainName: trainDetails.TrainName,
                IdSubTrain: trainDetails.IdSubTrain,
                IdUser: user.Id,
                FirstName: user.FirstName,
                Email: user.Email,
                BookingFor: trainDetails.DepartureDate,
                Initial: trainDetails.Initial,
                Destination: trainDetails.Destination,
                NoOfSeats: rowData?.length,
                IdSubTrainCoach: selectedCoach[0].IdSubCoach,
                Fare: paymentAmount,
                PaymentMethod: paymentMethod,
                MealPreference: mealPref,
                Passengers: rowData
            }
            var res = await fetch(variables.API_URL + "bookings", {
                method: "POST",
                headers: {
                  'Accept': 'application/json, text/plain',
                  'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(data),
              });
              let resJson = await res.json();
            if(resJson === "Ticket Booked"){
                alert("Ticket Booked. Hope you have a safe journey.")
                navigate("/findtrains", { replace: true });
            }
        }

    }
    return (
        <div className='h-[90%] flex flex-col justify-center items-center bg-[#90ABEE] m-2 rounded-lg'>
            <div className="flex flex-col justify-center items-center w-[90%] h-[90%] bg-white rounded-lg">
                <label className="text-2xl font-bold mt-6 text-center w-[90%]">Book Train : {trainDetails?.IdTrain} - {trainDetails?.TrainName}</label>
                <hr className="my-4 w-[90%]" />
                <div className="overflow-auto w-full h-full">
                    <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
                        <div className="flex flex-col justify-between items-center w-[90%]">
                            <div className="flex flex-col md:flex-row justify-between md:pb-4 w-[95%]">
                                <label>Train Number : </label>
                                <input disabled={true} defaultValue={trainDetails.IdTrain} className="bg-gray-100 rounded-lg px-2 py-1 text-center mb-2 md:mb-0" readOnly={true} ></input>
                                <label>Train Name : </label>
                                <input disabled={true} defaultValue={trainDetails.TrainName} className="bg-gray-100 rounded-lg px-2 py-1 text-center mb-2 md:mb-0" readOnly={true} ></input>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between md:pb-4 w-[95%]">
                                <label>Starts From : </label>
                                <input disabled={true} defaultValue={trainDetails.Initial} className="bg-gray-100 rounded-lg px-2 py-1 text-center mb-2 md:mb-0" readOnly={true} ></input>
                                <label>Ends At : </label>
                                <input disabled={true} defaultValue={trainDetails.Destination} className="bg-gray-100 rounded-lg px-2 py-1 text-center mb-2 md:mb-0" readOnly={true} ></input>
                            </div>
                            <div className="flex flex-col md:flex-row justify-between md:pb-4 w-[95%]">
                                <label>Departure Date : </label>
                                <input disabled={true} defaultValue={trainDetails.DepartureDate} className="bg-gray-100 rounded-lg px-2 py-1 text-center mb-2 md:mb-0" readOnly={true} ></input>
                                <label>Departure Time : </label>
                                <input disabled={true} defaultValue={trainDetails.DepartureTime} className="bg-gray-100 rounded-lg px-2 py-1 text-center mb-2 md:mb-0" readOnly={true} ></input>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row mt-4 md:mt-2 justify-center md:justify-between items-center w-[80%] md:w-[50%]">
                            <div>
                                <label className="font-bold px-4 py-2">Select Class:</label>
                                <select className={`rounded-lg border px-4 py-2 text-sm ml-4 ${!wclass? 'border-red-600 bg-red-50':''}`} name="paymentOption" onChange={(e)=> {optionChanges(e); setWClass(true)}}>
                                    <option hidden={true}>Select Category</option>
                                    {coach?.map(x =>
                                        <option key={x.IdSubCoach}>{x.CoachName}</option>
                                    )}
                                </select>
                            </div>
                            <div className="flex flex-row mt-4 md:mt-2">
                                {selectedCoach ? <div className="w-full text-center">
                                    <label className="font-bold">Seats Remaining in {selectedCoach[0].CoachName} are: {selectedCoach[0].SeatsLeft}</label>
                                    {selectedCoach[0].SeatsLeft > 0 ? <div><label className="font-bold text-green-700">Confirmed seat can be booked</label></div>
                                        : <div><label className="font-bold text-red-700">Waiting List ticket will be booked</label></div>}
                                </div> :
                                    <label>Select Coach to see Remaining Seats</label>}
                            </div>
                        </div>


                        <div className="flex flex-col justify-between items-center w-[90%]">
                            <div className="flex flex-col justify-start items-start w-[95%] mt-4">
                                <label>
                                    <button type={"button"} onClick={() => {addTableRows(); setWRow(true)}} ><ion-icon name="add-outline"></ion-icon></button>
                                    Add Passenger Details
                                </label>
                                <div className="overflow-auto rounded-md w-full">
                                    <table className="text-sm text-left w-full text-gray-500">
                                        <thead className={`text-xs text-gray-700 bg-gray-200 uppercase whitespace-nowrap  ${!wrow? 'border-red-600 bg-red-50':''}`}>
                                            <tr>
                                                <th className="py-3 px-4">Name</th>
                                                <th className="py-3 px-4">Age</th>
                                                <th className="py-3 px-4">Gender</th>
                                                <th className="py-3 px-4">Phone Number</th>
                                                <th className="py-3 px-4">Email ID</th>
                                                <th className="py-3"><button type={"button"} onClick={() => {addTableRows(); setWRow(true)}} ><ion-icon name="add-outline"></ion-icon></button></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <TableRows rowsData={rowData} deleteTableRows={deleteTableRows} handleChange={handleChange} />
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center justify-between mt-4 w-full">

                                <div className="flex flex-col mt-4 justify-center items-center md:w-[33%]">
                                    <label className="font-bold text-sm">Meal Preference:</label>
                                    <select className={`rounded-lg border md:w-[60%] px-4 py-2 text-sm ${!wmeal?'border-red-500 bg-red-50':''}`} name="paymentOption" onChange={(e) => {setMealPref(e.target.value);setWMeal(true)}}>
                                        <option hidden={true}>Select Meal Preference</option>
                                        <option>Veg</option>
                                        <option>Non Veg</option>
                                        <option>Both</option>
                                    </select>
                                </div>

                                <div className="flex flex-col mt-4 justify-center items-center md:w-[33%] w-full">
                                    <label className="font-bold">Details will be sent to: </label>
                                    <input disabled={true} defaultValue={user.Email} className="bg-gray-100 rounded-lg px-2 py-2 w-full max-w-[250px] text-center" />
                                </div>

                                <div className="flex flex-col mt-4 justify-center items-center md:w-[33%]">
                                    <label className="font-bold">Payment Option:</label>
                                    <select className={`rounded-lg border md:w-[60%] px-4 py-2 text-sm ${!wpay?'border-red-500 bg-red-50':''}`} name="paymentOption" onChange={(e) => { setPaymentMethod(e.target.value); setWPay(true) }}>
                                        <option hidden={true}>Select Payment Method</option>
                                        <option>UPI</option>
                                        <option>Net Banking</option>
                                        <option>Credit/Debit Card</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <hr className="mt-4 w-[90%]" />
                        <div className="flex flex-col mt-2 justify-center items-center">
                            <label className="font-bold">Final Amount:</label>
                            <label className="text-4xl font-bold">{paymentAmount}</label>
                        </div>

                        <div className="w-[90%] items-center text-center">
                            <input className="m-2" type={"checkbox"} onClick={(e)=>setAck(!ack)}></input>
                            <label>I, {user.FirstName} confirm the Train, Passengers and Amount to be payed.</label>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between w-[80%] md:w-[40%] mt-4 mb-4">
                            <button type={"submit"} className="bg-blue-600 w-full mb-2 md:mb-0 md:mr-4 md:w-[80%] h-10 rounded-md text-white hover:bg-orange-500 duration-500">Book Ticket</button>
                            <button type={"reset"} className="bg-blue-600 w-full mt-2 md:mt-0 md:ml-4 md:w-[80%] h-10 rounded-md text-white hover:bg-orange-500 duration-500" onClick={clear}>Reset</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}