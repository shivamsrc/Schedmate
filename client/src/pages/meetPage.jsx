import { useState, useEffect } from "react";
import { MeetAtom } from "../atoms/meet";
import { useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function SchedulePage() {
    const meet = useRecoilValue(MeetAtom);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startTime, setStartTime] = useState(meet?.start || "");
    const [endTime, setEndTime] = useState(meet?.end || "");
    const [requestedTo, setRequestedTo] = useState(meet?.requestedTo || "");
    const [showButton, setShowButton] = useState(false);
    const [status, setStatus] = useState("");
    const [start, setStart] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const parts = location.pathname.split("/");
    const lastSegment = parts[parts.length - 1];

    const handleChange = () => {
        setShowButton(title && description && startTime && endTime);
    };

    function convertTo24Hour(time) {
        const [_, h, m, period] = time.match(/(\d+):(\d+) (\w+)/);
        let hour = parseInt(h);
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, "0")}:${m}`;
    }

    const handleSchedule = async () => {
        setStatus("processing");
        setStart(true);
        try{
            const res = await axios.post(`http://localhost:3000/schedmate/user/main/meeting/schedule/${lastSegment}`, 
                {
                    title: title,
                    description: description,
                    startTime: new Date(`${meet.selectedDate}T${convertTo24Hour(meet.start)}:00`).toISOString(),
                    endTime: new Date(`${meet.selectedDate}T${convertTo24Hour(meet.end)}:00`).toISOString()
                },
                {withCredentials: true}
            )
            if (res.status === 201) {
                setStatus("success");
            } 
            else if (res.status === 500) {
                setStatus("error");
            }
        }
        catch (err) {
            setStatus("error");
        } 
    }

    // navigate
    useEffect(()=>{
        setTimeout(()=>{
            if(status === "success") navigate("/user/bookings")
        }, 500)
    }, [status])

    return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-zinc-900/90 rounded-3xl shadow-xl p-10 space-y-8 border border-zinc-800">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600 text-center mb-6">
                Schedule Your Meeting
            </h1>

            <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div className="flex flex-col">
                    <label className="text-gray-400 font-medium mb-2">Meeting Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); handleChange(); }}
                        placeholder="Enter title"
                        className="px-5 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                    />
                </div>

                {/* Description */}
                <div className="flex flex-col">
                    <label className="text-gray-400 font-medium mb-2">Description</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => { setDescription(e.target.value); handleChange(); }}
                        placeholder="Enter description"
                        className="px-5 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-lg"
                    />
                </div>

                {/* Start & End Time */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex flex-col">
                        <label className="text-gray-400 font-medium mb-2">Start Time</label>
                        <input
                            type="time-local"
                            readOnly
                            value={meet.start}
                            className="px-5 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                        />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <label className="text-gray-400 font-medium mb-2">End Time</label>
                        <input
                            type="time-local"
                            readOnly
                            value={meet.end}
                            className="px-5 py-3 rounded-2xl bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                        />
                    </div>
                </div>
            </div>

            {/* Schedule Button */}
            {showButton && (
            <div className="pt-4">
                <button onClick={handleSchedule} className="w-full py-4 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-extrabold text-lg shadow-sm hover:scale-101 hover:shadow-indigo-500/50 transition-transform">
                    Schedule Meeting
                </button>
            </div>
            )}
        </div>

        {/* Confirmation Overlay */}
        {start &&
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-3xl"></div>

                {/* Glass card */}
                {status === "processing" && (
                    <div className="relative flex flex-col items-center space-y-4 w-60 p-6 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg">
                    <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-red-400 font-semibold text-lg">Processing...</div>
                    </div>
                )}

                {status === "success" && (
                    <div className="relative flex flex-col items-center space-y-4 w-60 p-6 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-600">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" strokeDasharray="24" strokeDashoffset="24" style={{ animation: "draw 0.3s ease-out forwards" }} />
                            <style>
                                {` @keyframes draw {to {stroke-dashoffset: 0;}}`}
                            </style>
                        </svg>
                    </div>

                    <div className="text-green-400 font-bold text-lg">Booking Scheduled</div>
                    </div>
                )}

                {status === "error" && (
                    <div className="relative flex flex-col items-center space-y-4 w-60 p-6 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600 animate-pulse">
                        <svg
                        className="w-10 h-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div className="text-red-400 font-bold text-lg">Failed to Schedule</div>
                    </div>
                )}
            </div>
        }
    </div>
    );
}
