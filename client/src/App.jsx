import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProfileSetupPage from "./pages/profileSetup";

export default function App(){

    return <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/schedmate/profile/setup" element={<ProfileSetupPage/>}/>
            </Routes>
        </BrowserRouter>
    </div>
}