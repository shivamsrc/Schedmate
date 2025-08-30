import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProfileSetupPage from "./pages/profileSetup";
import MainPage from "./pages/MainPage";
import Bookings from "./pages/Bookings";

export default function App(){

    return <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/schedmate/profile/setup" element={<ProfileSetupPage/>}/>
                <Route path="/user/bookings" element={<MainPage/>}>
                    <Route index element={<Bookings/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </div>
}