import React from "react";

export const TableRows = ({rowsData, deleteTableRows, handleChange}) =>{

    return(
        rowsData.map((data,index) =>{
            const{Name, Age, Gender, PhoneNumber, Email} = data;
            return(
                <tr key={index} className=" text-gray-900 whitespace-nowrap border-b bg-white">
                    <td><input className="p-2" type={"text"} value={Name} onChange={(evnt)=>(handleChange(index, evnt))} name="Name"/></td>
                    <td><input className="p-2"  type={"number"} min={1} max={120} value={Age}  onChange={(evnt)=>(handleChange(index, evnt))} name="Age"/> </td>
                    <td><select className="p-2" value={Gender} onChange={(evnt)=>(handleChange(index, evnt))} name="Gender">
                            <option hidden={true}>Options</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select></td>

                    <td><input className="p-2" type={"tel"} maxLength={10} value={PhoneNumber}  onChange={(evnt)=>(handleChange(index, evnt))} name="PhoneNumber" /> </td>
                    <td><input className="p-2" type={"email"} value={Email}  onChange={(evnt)=>(handleChange(index, evnt))} name="Email" /> </td>
                    <td><button className="p-2" type={"button"} onClick={()=>(deleteTableRows(index))}><ion-icon name="trash-outline"></ion-icon></button></td>
                </tr>
            )
        })
    )
}