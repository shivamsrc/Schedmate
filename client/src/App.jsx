import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import LandingPage from "./pages/LandingPage";

export default function App(){

    return <div>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
            </Routes>
        </BrowserRouter>
    </div>
}