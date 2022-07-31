import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { variables } from "../../api/Variables";

export const FindTrains = () => {
  let navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [initial, setIntial] = useState();
  const [destination, setDestination] = useState();
  const [dateOfTravel, setDateOfTravel] = useState();

  let refreshStations = () => {
    fetch(variables.API_URL + "search/stations")
      .then(res => res.json())
      .then(res => setStations(res))
  }


  useEffect(() => {
    refreshStations()
  }, [])

  const handleSubmit = () => {
    navigate("/trains", { state: { default: false, idInitial: initial, idDestination: destination, dateOfTravel: dateOfTravel } }, { replace: true });
  }
  const alltrains = () => {
    navigate("/trains", { state: { default: true } }, { replace: true });
  }

  return (
    <div className='h-[90%] flex flex-col justify-center items-center bg-[#90ABEE] m-2 rounded-lg'>
      <div className="bg-white rounded-lg w-[90%] max-w-lg p-6" >
        <div>
          <h2 className="text-center text-2xl"><b>Find Trains</b></h2>
          <hr className="mt-2" />
          <form className="flex flex-col">
            <div className="flex flex-row items-center justify-between p-3">
              <label>From:</label>
              <select className="rounded-lg border w-[50%] px-4 py-2 text-sm" onChange={e => setIntial(e.target.value)}>
                <option hidden={true}>Stations</option>
                {stations?.map(x =>
                  <option id={x.Id} key={x.Id}>{x.Value}</option>
                )}
              </select>
            </div>

            <div className="flex flex-row items-center justify-between p-3">
              <label>To:</label>
              <select className="rounded-lg w-[50%] border py-2 px-4 text-sm" onChange={e => setDestination(e.target.value)}>
                <option hidden={true}>Stations</option>
                {stations?.map(x =>
                  <option key={x.Id}>{x.Value}</option>
                )}
              </select>
            </div>

            <div className="flex flex-row items-center justify-between p-3">
              <label>Date of Travel:</label>
              <input type={"date"} className="rounded-lg w-[50%] py-2 px-4 border text-sm" onChange={e => setDateOfTravel(e.target.value)} />
            </div>
            <div className="flex flex-row items-center justify-between w-full p-2">
              <button type={"button"} onClick={handleSubmit} className="bg-blue-600 w-full m-1 h-10 rounded-md text-white hover:bg-orange-500 duration-500">SUBMIT</button>
              <button type={"reset"} className="bg-blue-600 w-full m-1 h-10 rounded-md text-white hover:bg-orange-500 duration-500">RESET</button>
            </div>
            <hr />
            <div className="flex flex-row items-center justify-between p-2 mt-1">
              <button type={"button"} className="bg-blue-600 w-full h-10 rounded-md text-white hover:bg-orange-500 duration-500" onClick={alltrains}>VIEW ALL TRAINS</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
