import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProfileSetupPage from "./pages/profileSetup";
import MainPage from "./pages/MainPage";
import Bookings from "./pages/Bookings";
import Availability from "./pages/Availability";
import PublicPage from "./pages/PublicPage";
import MeetPage from "./pages/meetPage";
import Privacy from "./pages/privacyPolicy";

export default function App(){

    return <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/schedmate/privacy-policy" element={<Privacy/>}/>
                <Route path="/schedmate/profile/setup" element={<ProfileSetupPage/>}/>
                <Route path="/user" element={<MainPage/>}>
                    <Route path="bookings" element={<Bookings/>}/>
                    <Route path="availability" element={<Availability/>}/>
                </Route>
                <Route path="/user/publicpage/*" element={<PublicPage/>}/>
                <Route path="/schedule/meet/*" element={<MeetPage/>}/>
            </Routes>
        </BrowserRouter>
    </div>
}