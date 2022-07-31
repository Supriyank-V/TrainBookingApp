import React, { useEffect, useState } from "react";
import { variables } from "../../api/Variables";
import { PopupWindow } from "../PopupWindow";
import { useLocation, useNavigate } from 'react-router-dom'

export const TrainResult = () => {

    const state = useLocation();
    const searchData = state.state;
    const refreshList = () => {
        if (searchData === null || searchData?.default) {
            fetch(variables.API_URL + 'trains')
            .then(response => response.json())
            .then(data => {
                    setTrainData(data)
                })
            }
            else {
            fetch(variables.API_URL + `search/initial=${searchData.idInitial}&destination=${searchData.idDestination}&travelDate=${searchData.dateOfTravel}`)
                .then(response => response.json())
                .then(data => {
                    setTrainData(data)
                })
            }
        }
    let navigate = useNavigate();
    const [trains, setTrainData] = useState([]);
    const [window, setWindow] = useState(false);
    const [coach, setCoach] = useState([]);
    const [coachWindow, setCoachWindow] = useState(false);
    const [selectTrainName, setTrainName] = useState([]);
    const [traindetails, setTrainDetails] = useState();
    
    const returnToFind = () => {
        navigate("/findtrains", { state: {Initial: searchData.idInitial, Destination: searchData.idDestination, dateOfTravel: searchData.dateOfTravel } }, { replace: true });
    }
    
    const trainDetails = (selectedId) => {
        if (selectedId === undefined) {
            alert("Please Select a Train to View Details")
        }
        else {
            fetch(variables.API_URL + `trains/path/${selectedId}`)
            .then(res => res.json())
            .then(data => {
                setTrainDetails(data)
            })
            setWindow(true)
        }
    }
    const coachDetails = (selectedId) => {
        if (selectedId === undefined) {
            alert("Please Select a Train Row to View Details")
        }
        else {
            console.log(selectedId)
            fetch(variables.API_URL + `trains/coaches/${selectedId}`)
            .then(res => res.json())
            .then(data => {
                setCoach(data)
                })
                setCoachWindow(true)
            }
        }
        
        let row = true;
        
        const bookTrain = (trainDetails) => {
            if (trainDetails.length === 0) {
                alert("Please Select a Train to Book")
            }
            else {
                navigate("/booking", { state: { train: trainDetails } });
            }
        }
        
        useEffect(() => {
            refreshList();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
        console.log(selectTrainName)
        return (
            <div className='h-[90%] flex flex-col justify-center items-center bg-[#90ABEE] m-2 rounded-lg'>
            <div className="flex flex-col justify-center items-center w-[90%] h-[90%] rounded-lg bg-white">
                <label className="text-2xl font-bold">List of Trains</label>
                <hr className="my-4 w-[90%]" />
                <div className="overflow-auto rounded-md w-[90%] h-[70%]">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 bg-gray-200 uppercase whitespace-nowrap md:sticky top-0 z-[0]">
                            <tr>
                                <th scope="col" className="py-3 px-4">Actions</th>
                                <th scope="col" className="py-3 px-4">TR Number</th>
                                <th scope="col" className="py-3 px-4">Train Name</th>
                                <th scope="col" className="py-3 px-4">Starts From</th>
                                <th scope="col" className="py-3 px-4">Ends At</th>
                                <th scope="col" className="py-3 px-4">Departure Date</th>
                                <th scope="col" className="py-3 px-4">Departure Time</th>
                                <th scope="col" className="py-3 px-4">Arrival Date</th>
                                <th scope="col" className="py-3 px-4">Arrival Time</th>
                                <th scope="col" className="py-3 px-4">Journey Time</th>
                                <th scope="col" className="py-3 px-4">Coach</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trains?.map(train => {
                                row = !row;
                                return (
                                    <tr key={train.IdSubTrain} className={`py-4 px-4 text-gray-900 whitespace-nowrap border-b ${row ? 'bg-gray-100' : 'bg-white'}`}>
                                        <td className="py-4 px-4">
                                            <label className="text-xs font-bold hover:underline text-blue-500 hover:cursor-pointer pr-1" onClick={() => bookTrain(train)}>Book</label>
                                            <label>|</label>
                                            <label className="text-xs font-bold hover:underline text-blue-500 hover:cursor-pointer pl-1" onClick={() => { setTrainName(train); trainDetails(train.IdTrain) }}>Details</label>
                                        </td>
                                        <td className="py-4 px-4 font-medium">{train.IdTrain}</td>
                                        <td className="py-4 px-4 font-medium">{train.TrainName}</td>
                                        <td className="py-4 px-4">{train.Initial} ({train.InitialCode})</td>
                                        <td className="py-4 px-4">{train.Destination} ({train.DestinationCode})</td>
                                        <td className="py-4 px-4 font-medium">{train.DepartureDate}</td>
                                        <td className="py-4 px-4">{train.DepartureTime}</td>
                                        <td className="py-4 px-4 font-medium">{train.ArrivalDate}</td>
                                        <td className="py-4 px-4">{train.ArrivalTime}</td>
                                        <td className="py-4 px-4">{train.JourneyTime} hrs</td>
                                        <td className="py-4 px-4"><label className="text-xs font-bold hover:underline text-blue-500 hover:cursor-pointer pr-1" onClick={() => { setTrainName(train); coachDetails(train.IdSubTrain) }}>Coach Information</label></td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="md:w-[30%] w-[90%] pt-4 flex flex-row justify-between items-center">
                    <button className="bg-blue-600 w-full h-10 rounded-md text-white hover:bg-orange-500 duration-500" onClick={returnToFind}>Go back to Search Page</button>

                    <PopupWindow trigger={window} setTrigger={setWindow}>
                        <div className="w-full flex justify-center items-center">
                        <label className="font-bold text-xl pb-2">Train Details for {selectTrainName.IdTrain}-{selectTrainName.TrainName}</label>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between pt-2 text-sm pb-2">
                        <label><b>From:</b> {selectTrainName.Initial} ({selectTrainName.InitialCode})</label>
                        <label><b>To:</b> {selectTrainName.Destination} ({selectTrainName.DestinationCode})</label>
                        <label><b>Departure On:</b> {selectTrainName.DepartureDate} ({selectTrainName.DepartureTime})</label>
                        </div>
                        <hr/>
                        <div className="flex flex-col overflow-auto">
                            <label className="py-2 text-sm font-bold">Train Route</label>
                            <table>
                                <thead className="text-xs text-black bg-gray-300 border border-gray-300 uppercase whitespace-nowrap overflow-auto">
                                    <tr>
                                        <th className="px-2 py-1">Station Name</th>
                                        <th className="px-2 py-1">Arrival Time</th>
                                        <th className="px-2 py-1">Departure Time</th>
                                        <th className="px-2 py-1">Halt Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {traindetails?.map(x => (
                                        <tr key={x.IdTrainPath} className="py-1 px-1 text-xs font-medium text-center text-gray-900">
                                            <td className="px-1 py-1 border border-gray-300">{x.Station} ({x.StationCode})</td>
                                            <td className="px-1 py-1 border border-gray-300">{x.ExpectedArrival? x.ExpectedArrival : '--'}</td>
                                            <td className="px-1 py-1 border border-gray-300">{x.ExpectedDeparture? x.ExpectedDeparture : '--'}</td>
                                            <td className="px-1 py-1 border border-gray-300">{x.HaltTime ? x.HaltTime + ' mins' : '--'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col overflow-auto">
                            <label className="py-2 text-sm font-bold">Train Runs on</label>
                            <table>
                                <thead className="text-xs text-black bg-gray-300 border border-gray-300 uppercase whitespace-nowrap overflow-auto">
                                    <tr>
                                        <th className="px-2 py-1">Su</th>
                                        <th className="px-2 py-1">Mon</th>
                                        <th className="px-2 py-1">Tue</th>
                                        <th className="px-2 py-1">Wed</th>
                                        <th className="px-2 py-1">Thrus</th>
                                        <th className="px-2 py-1">Fri</th>
                                        <th className="px-2 py-1">Sat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        <tr className="py-1 px-1 text-xs font-medium text-center text-gray-900">
                                            <td className="px-1 py-1 border border-gray-300">{selectTrainName.Sunday? 'Yes': '--'}</td>
                                            <td className="px-1 py-1 border border-gray-300">{selectTrainName.Monday? 'Yes': '--'}</td>
                                            <td className="px-1 py-1 border border-gray-300">{selectTrainName.Tuesday? 'Yes': '--'}</td>
                                            <td className="px-1 py-1 border border-gray-300">{selectTrainName.Wednesday? 'Yes': '--'}</td>
                                            <td className="px-1 py-1 border border-gray-300">{selectTrainName.Thrusday? 'Yes': '--'}</td>
                                            <td className="px-1 py-1 border border-gray-300">{selectTrainName.Friday? 'Yes': '--'}</td>
                                            <td className="px-1 py-1 border border-gray-300">{selectTrainName.Saturday? 'Yes': '--'}</td>
                                        </tr>
                                </tbody>
                            </table>
                        </div>
                    </PopupWindow>

                    <PopupWindow trigger={coachWindow} setTrigger={setCoachWindow}>
                        <div className="w-full flex justify-center items-center">
                        <label className="font-bold text-xl pb-2">Train Details for {selectTrainName.TrainName}</label>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between pt-2 text-sm pb-2">
                        <label><b>From:</b> {selectTrainName.Initial}</label>
                        <label><b>To:</b> {selectTrainName.Destination}</label>
                        <label><b>Departure On:</b> {selectTrainName.DepartureDate} ({selectTrainName.DepartureTime})</label>
                        </div>
                        <hr/>
                        <div className="flex flex-col overflow-auto">
                            <label className="py-2 text-sm font-bold">Coach Information:</label>
                            <table>
                                <thead className="text-xs text-black bg-gray-300 uppercase whitespace-nowrap overflow-auto" >
                                    <tr>
                                        <th className="px-1 py-1 border border-gray-300">Coach Name</th>
                                        <th className="px-1 py-1 border border-gray-300">Seats</th>
                                        <th className="px-1 py-1 border border-gray-300">Total Fare</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coach?.map(x => (
                                        <tr key={x.IdSubCoach} className={`py-1 px-1 text-xs font-medium text-center text-gray-900 ${x.SeatsLeft === 0? 'bg-gray-400':''}`}>
                                            <td className="px-1 py-1 border border-gray-300">{x.CoachName}</td>
                                            <td className="px-1 py-1 border border-gray-300">{x.SeatsLeft}</td>
                                            <td className="px-1 py-1 border border-gray-300">{x.Fare}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <hr className="py-2"/>
                        <div className="flex flex-col">
                            <label className="py-1 text-sm font-bold">Meal Available: <label className="py-2 text-sm font-normal">{selectTrainName.VegFood? 'Veg' : '--'} / {selectTrainName.NonVegFood? 'Non-Veg' : '--'}</label> </label>
                            <label className="py-1 text-sm font-bold">Bedding Available: <label className="py-2 text-sm font-normal">{selectTrainName.Beddings? 'Yes' : 'No'}</label></label>
                        </div>
                    </PopupWindow>
                </div>
            </div>
        </div>
    )
}
