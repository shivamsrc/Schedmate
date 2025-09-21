import { useState, useEffect } from "react";
import { SpinnerAtom } from "../atoms/spinner";
import { useMediaQuery } from "../atoms/menuAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import DatePicker from "react-datepicker";
import { Switch } from "@headlessui/react";

export default function Availability(){

    return <div className="flex-1 flex flex-col">
        <Content/>
    </div>
}

function Content(){
    const isDesktop = useMediaQuery("(min-width: 780px)");
    const [availability, setAvailability] = useState([]);
    const [checkAvailabilityChange, setCheckAvailabilityChange] = useState([]);
    const spinner = useRecoilValue(SpinnerAtom);
    const setSpinner = useSetRecoilState(SpinnerAtom);
    const [saveButton, setSaveButton] = useState(false);
    const [Incomplete, setIncomplete] = useState(false);
    const API_BASE = import.meta.env.VITE_API_URL;

    useEffect(()=>{
        async function sendRequest(){
            setSpinner(true);
            const response = await axios.get(`${API_BASE}/schedmate/user/availability`, {withCredentials: true});
            const availabilities = response.data.availability.availabilities.map((day)=> (
                {...day, 
                 startTime: day.startTime ? new Date(day.startTime) : null,
                 endTime: day.endTime ? new Date(day.endTime) : null
                }))
            setAvailability(availabilities);
            setCheckAvailabilityChange(availabilities);
            setSpinner(false);
        }
        sendRequest();
    }, []);

    const handleAvailabilityChange = (i, key, value) => {
        const newAvailability = availability.map((day, index) => 
            (index === i ? {...day, [key]:value } : day));

        setAvailability(newAvailability);

        const hasChanged = newAvailability.some((day, index)=>{
            const original = checkAvailabilityChange[index];
            return day.available !== original.available
        });
        
        setSaveButton(hasChanged);
    }

    const cancelHandler = () => {
        const original = checkAvailabilityChange;
        setAvailability(original);
        setSaveButton(false);
    }

    const saveChangeHandler = () => {
        const incomplete = availability.filter((val, i)=>val.available == true && (val.startTime == null || val.endTime == null ))
        if(incomplete.length === 0)
        {
            async function sendPutReq(){
                setSpinner(true);
                const response = await axios.put(`${API_BASE}/schedmate/user/availability/update`, 
                    {availabilities: availability}, 
                    {withCredentials: true}
                );
                const availabilities = response.data.availability.availabilities.map((day)=> (
                    {...day, 
                     startTime: day.startTime ? new Date(day.startTime) : null,
                     endTime: day.endTime ? new Date(day.endTime) : null
                    }))
                setAvailability(availabilities);
                setCheckAvailabilityChange(availabilities);
                setSpinner(false);
                setSaveButton(false);
            }
            sendPutReq();
        }
        else{
            setIncomplete(true);
            setTimeout(()=>setIncomplete(false),1000)
        }
    }

    return <div className={`${isDesktop ? "ml-7" : "ml-0"} flex flex-1`}>
        <div className={`flex-1`}>
            {spinner ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
                <div className="w-12 h-12 border-4 border-transparent border-t-indigo-400 border-r-indigo-300 rounded-full animate-spin"></div>
            </div>) : 
            <div className="flex flex-col gap-4 p-1 sm:p-6">
                {availability.map((val, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-800/70 border border-zinc-700 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                    {/* Day and status */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3 sm:gap-0 sm:w-28">
                        <span className="text-gray-100 font-semibold text-lg">{val.day}</span>
                        <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                            val.available ? "bg-green-500 text-white" : "bg-gray-600 text-gray-200"
                        }`}
                        >
                        {val.available ? "Available" : "Unavailable"}
                        </span>
                    </div>

                    {/* Switch */}
                    <div className="flex justify-start sm:justify-center my-2 sm:ml-7 sm:my-0">
                        <Switch
                        checked={val.available}
                        onChange={(value) => {handleAvailabilityChange(i, "available", value)}}
                        className={`${
                            val.available ? "bg-green-500" : "bg-gray-600"
                        } relative inline-flex h-7 w-16 items-center rounded-full transition-colors duration-300`}
                        >
                        <span
                            className={`${
                            val.available ? "translate-x-9" : "translate-x-1"
                            } inline-block h-5 w-5 transform bg-white rounded-full shadow transition-transform duration-300`}
                        />
                        </Switch>
                    </div>

                    {/* Time Pickers */}
                    {val.available && (
                        <div className="flex sm:flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2 sm:ml-5 sm:mt-0 flex-1">
                        <DatePicker
                            selected={val.startTime}
                            onChange={(date) => {handleAvailabilityChange(i, "startTime", date)}}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption="Start"
                            dateFormat="h:mm aa"
                            className="w-full sm:w-32 border border-zinc-600 rounded-lg px-3 py-2 shadow-sm focus:ring-1 focus:ring-green-400 bg-white text-gray-900 placeholder-gray-400"
                            placeholderText="Start time"
                        />
                        <DatePicker
                            selected={val.endTime}
                            onChange={(date) => {handleAvailabilityChange(i, "endTime", date)}}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption="End"
                            dateFormat="h:mm aa"
                            className="w-full sm:w-32 border border-zinc-600 rounded-lg px-3 py-2 shadow-sm focus:ring-1 focus:ring-green-400 bg-white text-gray-900 placeholder-gray-400"
                            placeholderText="End time"
                        />
                        </div>
                    )}
                </div>
                ))}
                {/*cancel or save changes*/}
                {saveButton ?
                (<div className="flex justify-end gap-3 mt-4">
                    <button onClick={cancelHandler} className="px-4 py-2 rounded-lg border border-gray-500 text-gray-200 hover:bg-red-500 transition-colors duration-200 cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={saveChangeHandler} className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 cursor-pointer">
                        Save Changes
                    </button>
                </div>) : null
                }

                {Incomplete &&
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black font-medium px-5 py-3 rounded-xl shadow-lg animate-fade-in-out z-50 flex items-center gap-2">
                    <i className="fas fa-exclamation-triangle"></i>
                    Please fill all required fields
                </div>
                }
            </div>
            }
        </div>
    </div>
}