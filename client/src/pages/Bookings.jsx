import { useMediaQuery } from "../atoms/menuAtom";
import { useState, useEffect } from "react";
import axios from "axios";
import Spline from "@splinetool/react-spline";
import { SpinnerAtom } from "../atoms/spinner";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";

export default function Bookings(){

    return <div className="flex-1 flex flex-col">
        <Content/>
    </div>
}

function Content(){
    const isDesktop = useMediaQuery("(min-width: 780px)");
    const [user, setUser] = useState({});
    const [meetings, setMeetings] = useState([]);
    const spinner = useRecoilValue(SpinnerAtom);
    const setSpinner = useSetRecoilState(SpinnerAtom);
    const API_BASE =  process.env.REACT_APP_API_URL;

    useEffect(() => {
        async function request(){
            setSpinner(true);
            const response = await axios.get(`${API_BASE}/schedmate/user/main/`, {withCredentials: true});
            setUser(response.data.user);
            setMeetings(response.data.meetings.filter(m => m.status === "scheduled" && new Date(m.endTime) > Date.now()));

            if(response.status === 200){
                setSpinner(false)
            }
        }
        request();
    }, []);

    return (
    <div className={`${isDesktop ? "ml-7" : "ml-0"} flex flex-1`}>
        <div className={`flex-1 ${isDesktop? "" : ""}`}>
            {spinner ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl">
                <div className="w-12 h-12 border-4 border-transparent border-t-indigo-400 border-r-indigo-300 rounded-full animate-spin"></div>
            </div>) : 
            meetings.length > 0 ? (meetings.map((meeting, i) => (
            <div key={i} className="flex justify-between rounded-xl border border-white/10 bg-zinc-800/60 p-5 mb-4">
            {/* Left */}
                <div className="flex flex-col space-y-2 text-sm text-gray-200">
            
                    <div className="flex items-center gap-2 text-base font-semibold text-white">
                        <i className="fa-solid fa-thumbtack text-blue-400"></i>
                        {meeting.title}
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <i className="fa-solid fa-align-left"></i>
                    {meeting.description}
                    </div>

                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <i className="fa-regular fa-clock"></i>
                    {new Date(meeting.startTime).toLocaleDateString([], {dateStyle: "medium"})} : {new Date(meeting.startTime).toLocaleTimeString([], {timeStyle: "short", timeZone: user.timezone})} - {new Date(meeting.endTime).toLocaleTimeString([], {timeStyle: "short", timeZone: user.timezone})}
                    </div>

                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <i className="fa-solid fa-users"></i>
                    {meeting.requestedTo.name} & {meeting.requestedBy.name}
                    </div>

                    <div onClick={()=>{window.location.href=meeting.googlemeetId}} className="flex items-center gap-2 mt-2 text-sm font-medium text-green-400 hover:text-green-300">
                        <i className="fa-solid fa-video"></i>
                        Join Google Meet
                    </div>
                </div>

            {/* Right (Menu) */}
                <div className="flex text-gray-400 cursor-pointer relative group">
                    <i className="fa-solid fa-ellipsis hover:text-white"></i>
                    <div className={`invisible opacity-0 flex group-hover:visible group-hover:opacity-100 absolute top-5 right-5 items-center gap-2 px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-gray-300 hover:bg-red-500 hover:text-white shadow-md cursor-pointer transition duration-400 delay-100`}>
                        <span 
                            onClick={async ()=>{
                                setSpinner(true);
                                await axios.patch(`${API_BASE}/schedmate/user/main/meeting/${meeting._id}/cancel`, {}, {withCredentials: true})
                                setMeetings(prev => prev.filter(m => m._id !== meeting._id));
                                setSpinner(false);
                            }}>
                            cancel
                        </span>
                    </div>
                </div>
            </div>))) : (
      
            <div className="flex flex-col justify-center items-center flex-1 text-base font-medium text-gray-400">
                <div className="relative w-full max-w-[600px] h-[300px] sm:h-[400px] flex justify-center items-center">
                    <Spline scene="https://prod.spline.design/6aO34Cbs0PHFhIO7/scene.splinecode" />
                    <div className="absolute bottom-5 left-0 w-full h-12 bg-black"></div>
                </div>

                {!spinner && meetings.length === 0 && <div className="flex items-center mt-3 text-lg font-semibold text-gray-300">
                    <i className="fa-regular fa-calendar-xmark mr-3 text-red-400"></i>
                    <span>No upcoming meetings</span>
                </div>}
            </div>)}
        </div>
    </div>)
}