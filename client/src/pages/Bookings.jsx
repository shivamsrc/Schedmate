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

    useEffect(() => {
        async function request(){
            setSpinner(true);
            const response = await axios.get("http://localhost:3000/schedmate/user/main/", {withCredentials: true});
            setUser(response.data.user);
            setMeetings(response.data.meetings.filter(m => m.status === "scheduled"));

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
                <div className="flex flex-top text-gray-400 hover:text-white cursor-pointer">
                    <i className="fa-solid fa-ellipsis"></i>
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