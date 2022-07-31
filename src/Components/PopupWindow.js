import React from "react";

export const PopupWindow = (props) =>{
    return(props.trigger) ? (
        <div className="fixed top-0 left-0 w-[100%] h-[100vh] bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center">
            <div className="relative p-8
             w-[100%] max-w-[640px] bg-white rounded drop-shadow-lg">
                <button className="absolute top-2 right-2" onClick={()=>props.setTrigger(false)}><ion-icon name="close-outline"></ion-icon></button>
                {props.children}
            </div>
        </div>
    ):""
}
