import {Link as ScrollLink} from "react-scroll";
import {Link as RouterLink} from "react-router-dom";
import {useState, useEffect} from "react";
import {motion} from "framer-motion";
import Spline from "@splinetool/react-spline";
import {FcGoogle} from "react-icons/fc";
import { authAtom } from "../atoms/authAtom";
import {RecoilRoot, useRecoilValue, useSetRecoilState} from "recoil";

export default function LandingPage(){

    return (
    <RecoilRoot>
        <div className="relative min-h-screen text-white overflow-hidden">
            <Gradient/>
            <NavBar/>
            <div className="flex flex-row justify-between">
                <LeftSec/>
                <RightSec/>
            </div>
            <GoogleAuthCard/>
        </div>
    </RecoilRoot>
  );
}

function Gradient(){

    return (
    <div>
      {/* background gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#0c0315,#1a0b2e_50%,#0b0d2a)]" />

      {/* subtle radial highlights */}
      <div className="absolute inset-0">
        <div className="absolute left-[-120px] top-[-80px] w-[520px] h-[420px] rounded-full opacity-60 blur-[80px] bg-[radial-gradient(circle_at_30%_30%,#ff3ea1,#ff7a45_60%,transparent_80%)]" />
        <div className="absolute right-[-160px] bottom-[-80px] w-[560px] h-[460px] rounded-full opacity-60 blur-[80px] bg-[radial-gradient(circle_at_60%_40%,#00b3ff,#6a5cff_60%,transparent_80%)]" />
      </div>

      {/* grid overlay */}
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(transparent_95%,#ffffff10_96%),linear-gradient(90deg,transparent_95%,#ffffff10_96%)] bg-[length:100%_64px,64px_100%]" />
      
    </div>
    );
}

function NavBar(){
    const setShowAuthPage = useSetRecoilState(authAtom);

    function authPage(){
        setShowAuthPage((val) => !val)
    }

    return <div className="relative inset-0 flex z-1 justify-between pt-10 pl-45 pr-45">
        <div className="text-xl font-bold">
            Schedmate
        </div>
        <div className="flex w-110 justify-between text-[#d9d7e7] text-base">
            <ScrollLink to="" smooth={true} duration={500} className="cursor-pointer">SeeHow</ScrollLink>
            <ScrollLink to="" smooth={true} duration={500} className="cursor-pointer">Features</ScrollLink>
            <ScrollLink to="" smooth={true} duration={500} className="cursor-pointer">Feedback</ScrollLink>
            <ScrollLink to="" smooth={true} duration={500} className="cursor-pointer">Contact us</ScrollLink>
        </div>
        <div onClick={authPage} className="px-6 py-2 rounded-4xl bg-gradient-to-r from-pink-500 to-orange-400 text-white cursor-pointer hover:brightness-110 transition font-semibold">
            Sign in
        </div>
    </div>
}

function LeftSec(){
    const setShowAuthPage = useSetRecoilState(authAtom);

    function authPage(){
        setShowAuthPage((val) => !val)
    }

    return (
        <div className="relative flex flex-col z-2 w-130 h-100 ml-45 mt-30">

            <div className="bg-white/5 backdrop-blur-md border border-white/30 rounded-xl p-7 pt-9 pb-9 text-5xl font-extrabold">
                <div>Book your meeting</div>
                <div>
                    <TypingText/>
                </div>
            </div>

            <div className="mt-7 mb-7 text-[#d9d7e7] text-base">
                Stop wasting time juggling calendars. With Schedmate, share availability instantly, let people book in seconds, and keep every meeting organized and stress-free.
            </div>

            <div onClick={authPage} className="px-6 py-2 rounded-4xl bg-gradient-to-r from-pink-500 to-orange-400 text-white cursor-pointer hover:brightness-110 transition font-semibold w-33 text-center">
                Get started
            </div>
        </div>
    )
}

//

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      staggerChildren: 0.07, // delay between each letter
    },
  },
};
const letter = {
  hidden: { opacity: 0},
  visible: { opacity: 1 }
};
function TypingText() {
  const phrases = [
    "with Schemate",
    "anyday",
    "anytime",
    "with ease",
  ];

  const [index, setIndex] = useState(0);

  // change phrase every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <motion.span
        key={index} // re-trigger animation when this key changes by react
        variants={sentence}
        initial="hidden"
        animate="visible"
        className="font-extrabold text-5xl text-white"
      >
        {phrases[index].split("").map((char, i) => (
          <motion.span key={i} variants={letter}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </div>
  );
}


function RightSec(){

    return (
        <div className="relative w-160 h-160 -mt-10 pr-20 flex flex-start">
            <Spline   scene="https://prod.spline.design/SdrzbS97Voe8k4RH/scene.splinecode"/>
        </div>
    );
}

function GoogleAuthCard() {
    const showAuthPage = useRecoilValue(authAtom);
    const setShowAuthPage = useSetRecoilState(authAtom);

    function authPage(){
        setShowAuthPage(false)
    }

    const handleGoogleAuth = () => {
    window.location.href = "http://localhost:3000/schedmate/auth/signin";
    };

    return (
    <div onClick={authPage} className={`fixed inset-0 ${showAuthPage ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-300 ease-in-out flex items-center justify-center backdrop-blur-sm bg-black/40 z-50`}>
        <div onClick={(e)=> e.stopPropagation()} className="w-[350px] bg-white/90 rounded-2xl shadow-3xl p-6 flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold text-gray-800">Welcome</h1>
            <p className="text-gray-700">Sign in to continue</p>

            <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 hover:bg-gray-100 rounded-xl border shadow-md py-3"
            >
            <FcGoogle size={22} />
            <span>Continue with Google</span>
            </button>
        </div>
    </div>
  );
}