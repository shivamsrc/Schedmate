import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";
import { MenuAtom, useMediaQuery } from "../atoms/menuAtom";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function MainPage(){
    const isDesktop = useMediaQuery("(min-width: 780px)");
    const isDesktopMid = useMediaQuery("(min-width: 650px)");

    return (
    <RecoilRoot>
        <div className={`flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-white $ p-6 pt-0`}>
            <Headers/>
            <div className="flex-1 flex flex-row">
                {isDesktop ? <Menu/> : null}
                <div className="flex-1 flex flex-col">
                    <Outlet/>
                </div>
            </div>
            {!isDesktop && <Menu horizontal={true}/>}
        </div>
    </RecoilRoot>
    )
}

function Headers(){
    const isDesktop = useMediaQuery("(min-width: 780px)");
    const isDesktopLow = useMediaQuery("(max-width: 450px");
    const [user, setUser] = useState({});

    useEffect(()=>{
        async function request(){
            const response = await axios.get("http://localhost:3000/schedmate/user/main/", {withCredentials: true});
            setUser(response.data.user);
        }
        request();
    }, [])


    return <div className="sticky top-0 z-50 flex justify-between items-center mb-6 bg-gradient-to-r from-zinc-950/80 via-black/70 to-zinc-950/80 backdrop-blur-md -ml-6 -mr-6 p-2 shadow-lg rounded-b-2xl">
        <h1 className="text-2xl font-bold tracking-wide">Schedmate</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700">
            <img src={user.avatarUrl ? `${user.avatarUrl}` : `https://i.pinimg.com/1200x/9f/16/72/9f1672710cba6bcb0dfd93201c6d4c00.jpg`} alt="user" className="w-full h-full object-cover"/>
        </div>
    </div>
}


function Menu(props){
    const menuOn = useRecoilValue(MenuAtom);
    const setMenu = useSetRecoilState(MenuAtom);
    const horizontal = props.horizontal;
    const isDesktop = useMediaQuery("(min-width: 780px)");
    const isDesktopLow = useMediaQuery("(max-width: 450px");
    const location = useLocation();
    const currentPath = location.pathname.split("/");
    const lastSegment = currentPath[currentPath.length -1];

    const HandleMenuSwitch = () => {
        setMenu((val) => !val)
    }

    return <div className={`sticky top-20 left-5 bg-zinc-800 ${horizontal ? "p-2 mt-2 -mb-4" : "p-4"} ${menuOn ? "px-4 rounded-2xl" : "px-1 rounded-full"} shadow-lg ${isDesktop ? "p-0 m-0" : (horizontal ? "p-2 mt-2 -mb-4" : "p-4", menuOn ? "px-4 rounded-2xl" : "px-1 rounded-full")} max-h-[86vh]`}>
            <div className={`flex ${horizontal ? "flex-row gap-2 justify-around" : "flex-col gap-4"}`}>
                <div className={`flex items-center justify-end ${horizontal ? "py-0 px-1" : "py-2 px-3"} rounded-lg`}>
                    <div onClick={isDesktop ? HandleMenuSwitch : undefined} className="hover:bg-zinc-700 p-2 rounded-full"><i class="fa-solid fa-bars"></i></div>
                </div>
                <div className={`flex items-center justify-between ${menuOn ? "px-3" : "px-5"} ${horizontal ? "py-0" : "py-2"} rounded-lg hover:bg-zinc-700 ${lastSegment == "bookings" ? "bg-zinc-700" : ""}`}>
                    {menuOn ? <div className="mr-3">Bookings</div> : null}
                    <div><i class="fa-solid fa-calendar-alt"></i></div>
                </div>
                <div className={`flex items-center justify-between ${menuOn ? "px-3" : "px-5"} ${horizontal ? "py-0" : "py-2"} rounded-lg hover:bg-zinc-700 ${lastSegment == "availability" ? "bg-zinc-700" : ""}`}>
                    {menuOn ? <div className="mr-3">Availability</div> : null}
                    <div><i class="fa-solid fa-clock"></i></div>
                </div>
                <div className={`flex items-center justify-between ${menuOn ? "px-3" : "px-5"} ${horizontal ? "py-0" : "py-2"} rounded-lg hover:bg-zinc-700 ${lastSegment == "public" ? "bg-zinc-700" : ""}`}>
                    {menuOn ? <div className="mr-3">Public Page</div> : null}
                    <div><i class="fa-solid fa-user"></i></div>
                </div>
                <div className={`flex items-center justify-between ${menuOn ? "px-3" : "px-5"} ${horizontal ? "py-0" : "py-2"} rounded-lg hover:bg-zinc-700`}>
                    {menuOn ? <div className="mr-3">Copy Link</div> : null}
                    <div><i class="fa-solid fa-copy"></i></div>
                </div>
                <div className={`flex items-center justify-between ${menuOn ? "px-3" : "px-5"} ${horizontal ? "py-0" : "py-2"} rounded-lg text-red-400 hover:bg-zinc-700`}>
                   {menuOn ? <div>Logout</div> : null}
                   <LogOut className="w-4 h-4" />
                </div>
            </div>
        </div>
}
