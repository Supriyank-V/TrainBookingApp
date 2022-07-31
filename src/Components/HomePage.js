import React from 'react'
import EngineRight from "../images/EngineRight.jpg"
import MaharajaTrain from "../images/MaharajaTrain.jpg"
import OrangeTrain from "../images/OrangeTrain.jpg"


export const HomePage = () => {
  return (
    <div className='h-[90%] flex flex-col justify-center items-center bg-[#90ABEE] m-2 rounded-lg overflow-auto'>
      <div className="flex flex-col justify-start items-center w-[90%] h-[90%] bg-white rounded-lg overflow-auto">
        <label className="text-2xl font-bold mt-6 text-center w-[90%]">Welcome to Train Booking Application</label>
        <hr className="my-4 w-[90%]" />
        <div className='flex flex-col mt-4 md:mt-2 justify-between items-center w-[90%] h-full'>
          <label className='text-center text-sm'>Book your trains with ease using our train booking app.</label>
          <label className='text-center text-sm'>Hope you have a Happy Journey.</label>
          <hr className="w-full" />
          <div className='overflow-auto w-full h-[50%] md:h-[60%]'>
          <div className='flex flex-row items-center justify-start h-[90%]'>
            <img alt='' src={EngineRight} className="h-full md:w-[40%] rounded-lg m-1 shadow-lg"/>
            <img alt='' src={MaharajaTrain} className="h-full md:w-[40%] rounded-lg m-1 shadow-lg"/>
            <img alt='' src={OrangeTrain} className="h-full md:w-[40%] rounded-lg m-1 shadow-lg"/>            
          </div>
          </div>
          <div className='flex flex-row h-[10%]'>
            <label className='text-center text-xs'>©Aberton Studio 2022, built using React</label>
          </div>
        </div>
      </div>
    </div>
  )
}