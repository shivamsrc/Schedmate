import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../atoms/fullCalendarDark.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { MeetAtom } from "../atoms/meet";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function Content() {
    const [user, setUser] = useState({});
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDay, setSelectedDay] = useState("");
    const [availability, setAvailability] = useState([]);
    const [meetSlots, setMeetSlots] = useState([]);
    const [showButton, setShowButton] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const MeetData = useRecoilValue(MeetAtom);
    const setMeetData = useSetRecoilState(MeetAtom);
    const [selctedSlot, setSelectedSlot] = useState(null);

    const parts = location.pathname.split("/");
    const lastSegment = parts[parts.length - 1];

    useEffect(() => {
        async function request() {
            try {
                const res = await axios.get(
                `http://localhost:3000/schedmate/user/${lastSegment}`,
                { withCredentials: true }
                );
                setUser(res.data.user);
            } 
            catch (err) {
                console.error(err);
            }
        }
        request();
    }, [lastSegment]);


    useEffect(() => {
        async function sendReq() {
            const response = await axios.get(
                `http://localhost:3000/schedmate/user/availability/${lastSegment}`,
                { withCredentials: true }
            );
            const availabilities = response.data.availability.availabilities.map((day) => ({
                ...day,
                startTime: day.startTime ? new Date(day.startTime) : null,
                endTime: day.endTime ? new Date(day.endTime) : null,
            }));
            setAvailability(availabilities);
        }
        sendReq();
    }, [lastSegment]);

    // Handle date click
    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);
        const dayName = info.date.toLocaleString("en-US", { weekday: "long" });
        setSelectedDay(dayName);

        const dayData = availability.find((a) => a.day === dayName);
        if (!isDayAvailable(dayName)) {
            setMeetSlots([]);
            return;
        }
        const { startTime, endTime } = dayData;

        function generateInterval(start, end) {
            const slots = [];
            let current = new Date(start);

            while (current < end) {
                let next = new Date(current.getTime() + 60 * 60 * 1000);
                if (next > end) next = end;

                slots.push({
                    start: current.toLocaleString([], {hour: "2-digit", minute: "2-digit",}),
                    end: next.toLocaleString([], {hour: "2-digit", minute: "2-digit",}),
                });

                current = next;
            }

            return slots;
        }

        const interval = generateInterval(startTime, endTime);
        setMeetSlots(interval);
    };

    // Check if available
    const isDayAvailable = (date) => {
        const dayName = typeof date === "string" ? date : date.toLocaleString("en-US", { weekday: "long" });
        const dayData = availability.find((a) => a.day === dayName);
        return dayData ? dayData.available : false;
    };

    // time click handler
    const TimeHandler = (obj, i) => {
        setMeetData({start: obj.start, end: obj.end, requestedTo: lastSegment});
        setShowButton(true);
        setSelectedSlot(i);
    }

    // meeting schedule handler
    const ProceedHandler = () => {
        navigate("/schedule/meet")
    }

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-6 sm:p-10 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white space-y-12">
        {/* User details */}
        <div className="max-w-md w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center space-y-6 transition">
            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-indigo-500 shadow-lg">
                <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover"/>
            </div>

            <h1 className="text-2xl font-bold text-white">{user.name}</h1>

            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                {user.bio || "This user hasn't added a bio yet"}
            </p>

            <div className="w-2/3 border-t border-zinc-700"></div>

            <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow hover:scale-105 transition"
            >
            {showCalendar ? "Hide Calendar" : "Book a Meeting"}
            </button>
        </div>

        {showCalendar && (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
            {/* Calendar */}
            <div className="flex-1 bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl shadow-xl">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    dateClick={handleDateClick}
                    height="auto"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "",
                    }}
                    dayCellDidMount={(info) => {
                        if (!isDayAvailable(info.date)) {
                            info.el.style.opacity = "0.3";
                            info.el.style.pointerEvents = "none";
                            info.el.style.backgroundColor = "rgba(239, 68, 68, 0.05)";
                        }
                    }}
                />
            </div>

            {/* Time Slots */}
            {selectedDate && (
            <div className="flex-1 flex flex-col bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl shadow-xl text-center space-y-4">
                <h2 className="text-lg font-semibold text-white">
                    Available times on{" "}
                    <span className="text-indigo-400">{selectedDate}</span>
                </h2>
                {isDayAvailable(selectedDay) ? (
                    <div className="flex flex-col gap-3">
                        {meetSlots.map((obj, i) => (
                            <div onClick={()=>TimeHandler(obj, i)} key={i} className={`px-4 py-2 rounded-lg bg-zinc-800 text-gray-200 shadow hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition cursor-pointer ${selctedSlot === i && "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"}`}>
                                {obj.start} - {obj.end}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-red-400 font-medium">Unavailable</div>
                )}

                {showButton && <div className="mt-6 self-end">
                    <button onClick={ProceedHandler} className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-sm hover:scale-105 hover:shadow-emerald-500/40 transition flex items-center gap-2">
                        Proceed
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>}
            </div>
            )}
        </div>
        )}
    </div>
    );
}