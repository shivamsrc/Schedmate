import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";
import { MenuAtom, useMediaQuery } from "../atoms/menuAtom";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SpinnerAtom } from "../atoms/spinner";
import { LogoutAtom } from "../atoms/logoutAtom";

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
            <LogOutCard/>
        </div>
    </RecoilRoot>
    )
}

function Headers(){
    const isDesktop = useMediaQuery("(min-width: 780px)");
    const isDesktopLow = useMediaQuery("(max-width: 450px");
    const [user, setUser] = useState({});
    const API_BASE = import.meta.env.VITE_API_URL;

    useEffect(()=>{
        async function request(){
            const response = await axios.get(`${API_BASE}/schedmate/user/main/`, {withCredentials: true});
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
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [copied, setCopied] = useState(false);
    const setShowLogoutCard = useSetRecoilState(LogoutAtom);
    const API_BASE = import.meta.env.VITE_API_URL;


    useEffect(()=>{
        async function request(){
            const response = await axios.get(`${API_BASE}/schedmate/user/main/`, {withCredentials: true});
            setUser(response.data.user);
        }
        request();
    }, [])

    useEffect(()=>{
        if(!isDesktop){
            setMenu(false)
        }
    }, [isDesktop]);

    const HandleMenuSwitch = () => {
        setMenu((val) => !val)
    }

    const navigateBooking = () => {
        navigate("/user/bookings")
    }
    const navigateAvailability = () => {
        navigate("/user/availability")
    }
    const navigatePublicPage = () => {
        navigate(`/user/publicpage/${user._id}`)          // give params
    }

    const copyHandler = () => {
        const text = `https://schedmate.vercel.app/user/publicpage/${user._id}`;
        navigator.clipboard.writeText(text).then(()=>{
            setCopied(true);
            setTimeout(()=>{setCopied(false)}, 700)
        })
    }

    return <div className={`sticky top-20 left-5 bg-zinc-800 ${horizontal ? "p-2 -ml-4 -mr-4 mt-2 -mb-4 " : "p-4"} ${menuOn ? "px-4 rounded-2xl" : "px-1 rounded-full"} shadow-lg ${isDesktop ? "p-0 m-0" : (horizontal ? "p-2 mt-2 -mb-4" : "p-4", menuOn ? "px-4 rounded-2xl" : "px-1 rounded-full")} max-h-[86vh]`}>
            <div className={`flex ${horizontal ? " flex-row gap-2 justify-around" : "flex-col gap-4"}`}>
                {horizontal ? null : <div className={`flex items-center justify-end ${horizontal ? "py-0 px-1" : "py-2 px-3"} rounded-lg max-[390px]:px-2 max-[390px]:gap-1`}>
                    <div onClick={isDesktop ? HandleMenuSwitch : undefined} className="hover:bg-zinc-700 p-2 rounded-full"><i class="fa-solid fa-bars"></i></div>
                </div>}
                <div onClick={navigateBooking} className={`flex items-center justify-between ${menuOn ? "px-3" : "px-5"} ${horizontal ? "py-0" : "py-2"} rounded-lg hover:bg-zinc-700 ${lastSegment == "bookings" ? "bg-zinc-700" : ""} max-[390px]:px-2 max-[390px]:gap-1`}>
                    {menuOn ? <div className="mr-3">Bookings</div> : null}
                    <div><i class="fa-solid fa-calendar-alt"></i></div>
                </div>
                <div onClick={navigateAvailability} className={`flex items-center justify-between ${menuOn ? "px-3" : "px-5"} ${horizontal ? "py-0" : "py-2"} rounded-lg hover:bg-zinc-700 ${lastSegment == "availability" ? "bg-zinc-700" : ""} max-[390px]:px-2 max-[390px]:gap-1`}>
                    {menuOn ? <div className="mr-3">Availability</div> : null}
                    <div><i class="fa-solid fa-clock"></i></div>
                </div>
                <div onClick={navigatePublicPage} className={`flex items-center justify-between ${menuOn ? "px-3" : "px-5"} ${horizontal ? "py-0" : "py-2"} rounded-lg hover:bg-zinc-700 ${lastSegment == "public" ? "bg-zinc-700" : ""} max-[390px]:px-2 max-[390px]:gap-1`}>
                    {menuOn ? <div className="mr-3">Public Page</div> : null}
                    <div><i class="fa-solid fa-user"></i></div>
                </div>
                <div onClick={copyHandler} className={`relative flex items-center justify-between ${menuOn ? "px-3" : "px-5"} ${horizontal ? "py-0" : "py-2"} rounded-lg hover:bg-zinc-700 cursor-pointer max-[390px]:px-2 max-[390px]:gap-1`}>
                    {menuOn ? <div className="mr-3">Copy Link</div> : null}
                    <div className={`transition transform ${copied ? "scale-125 text-blue-400" : "scale-100 text-white"}`}>
                        <i className="fa-solid fa-copy"></i>
                    </div>
                </div>
                <div onClick={()=>{setShowLogoutCard(val=>!val)}} className={`flex items-center justify-between ${menuOn ? "px-3" : "px-5"} ${horizontal ? "py-0" : "py-2"} rounded-lg text-red-400 hover:bg-zinc-700 max-[390px]:px-2 max-[390px]:gap-1`}>
                   {menuOn ? <div>Logout</div> : null}
                   <LogOut className="w-4 h-4" />
                </div>
            </div>
        </div>
}

function LogOutCard(){
    const showLogoutCard = useRecoilValue(LogoutAtom);
    const setShowLogoutCard = useSetRecoilState(LogoutAtom);
    const setSpinner = useSetRecoilState(SpinnerAtom);
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_URL;

    const handleLogoutCard = () => {
        setShowLogoutCard(false)
    }

    const handleLogout = async () => {
        setSpinner(true);
        const res = await axios.get(`${API_BASE}/schedmate/auth/logout`, {withCredentials: true});
        if(res.status === 200){
            setSpinner(false);
            navigate("/");
        }
    }

    return <div 
  onClick={handleLogoutCard} 
  className={`fixed inset-0 ${showLogoutCard ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm bg-black/40 z-50`}
>
  <div 
    onClick={(e)=> e.stopPropagation()} 
    className="w-[350px] bg-white/90 rounded-2xl shadow-3xl p-6 flex flex-col items-center gap-6 mx-5"
  >
    <h1 className="text-lg font-medium text-gray-800 text-center">
      Are you sure you want to log out?
    </h1>

    <div className="flex flex-col w-full gap-3">
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 rounded-xl shadow-md py-3 font-medium transition"
      >
        Log out
      </button>

      <button 
        onClick={()=> setShowLogoutCard(false)} 
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 hover:bg-gray-100 rounded-xl border shadow-sm py-3 font-medium transition"
      >
        Cancel
      </button>
    </div>
  </div>
</div>

}
