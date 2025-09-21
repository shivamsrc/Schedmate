import {Link as ScrollLink} from "react-scroll";
import {Link as RouterLink} from "react-router-dom";
import {useState, useEffect} from "react";
import {motion} from "framer-motion";
import Spline from "@splinetool/react-spline";
import {FcGoogle} from "react-icons/fc";
import { authAtom } from "../atoms/authAtom";
import {RecoilRoot, useRecoilValue, useSetRecoilState} from "recoil";
import { useMediaQuery } from "../atoms/menuAtom";
import videoFile from "../atoms/cursorful-video-1758386311228.mp4";
import { FaTwitter, FaTelegramPlane, FaEnvelope } from "react-icons/fa";

export default function LandingPage(){
  const isDesktop775 = useMediaQuery("(min-width: 775px)")

    return (
    <RecoilRoot>
        <div className="relative min-h-screen text-white overflow-hidden">
            <Gradient/>
            <NavBar/>
            <div className={`flex ${isDesktop775 ? "flex-row justify-between" : "flex-col-reverse w-full justify-center items-center"}`}>
                <LeftSec/>
                <RightSec/>
            </div>
            <GoogleAuthCard/>
            <SeeHow/>
            <Footer/>
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
    const isDesktop850 = useMediaQuery("(min-width: 850px)")
    const isDesktop675 = useMediaQuery("(min-width: 675px)")

    function authPage(){
        setShowAuthPage((val) => !val)
    }

    return <div className="relative inset-0 flex z-1 justify-between pt-10 xl:pl-45 xl:pr-45 md:pl-20 md:pr-20 pl-10 pr-10">
        <div className="text-xl font-bold">
            Schedmate
        </div>
        {isDesktop675 ? <div className="flex w-110 justify-between text-[#d9d7e7] text-base">
            <ScrollLink to="seehow" smooth={true} duration={500} className="cursor-pointer">SeeHow</ScrollLink>
            <ScrollLink to="" smooth={true} duration={500} className="cursor-pointer">Features</ScrollLink>
            <ScrollLink to="" smooth={true} duration={500} className="cursor-pointer">Feedback</ScrollLink>
            <ScrollLink to="contactus" smooth={true} duration={500} className="cursor-pointer">ContactUs</ScrollLink>
        </div> : null}
        { isDesktop850 ?
        <div onClick={authPage} className="px-6 py-2 rounded-4xl bg-gradient-to-r from-pink-500 to-orange-400 text-white cursor-pointer hover:brightness-110 transition font-semibold">
            Sign in
        </div> : null
        }
    </div>
}

function LeftSec(){
    const setShowAuthPage = useSetRecoilState(authAtom);
    const isDesktop850 = useMediaQuery("(min-width: 850px)")

    function authPage(){
        setShowAuthPage((val) => !val)
    }

    return (
        <div className="relative flex flex-col z-2 max-w-130 h-100 xl:mt-30 md:mt-20 mt-10 md:ml-10 xl:ml-35 2xl:ml-45 ml-5 mr-5">

            <div className="bg-white/5 backdrop-blur-md border border-white/30 rounded-xl p-7 pt-9 pb-9 sm:text-5xl text-4xl font-extrabold">
                <div>Book your meeting</div>
                <div>
                    <TypingText/>
                </div>
            </div>

            <div className="mt-7 mb-7 text-[#d9d7e7] text-base">
              { isDesktop850 ? 
              "Stop wasting time juggling calendars. With Schedmate, share availability instantly, let people book in seconds, and keep every meeting organized and stress-free."
                : "Schedmate lets you share availability, get booked in seconds, and keep meetings stress-free."
              }
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
        className="font-extrabold sm:text-5xl text-4xl text-white"
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

// relative w-160 h-160 -mt-10 pr-20 flex flex-start

function RightSec() {
  const isDesktop775 = useMediaQuery("(min-width: 775px)");

  return (
    <div
      className={`relative flex 
        ${isDesktop775 ? "justify-start items-start" : "justify-center items-center"} 
        w-90 h-90 mt-2
        2xl:w-160 2xl:h-160 2xl:-mt-10 xl:pr-20
        lg:w-120 lg:h-120 lg:mt-4 lg:pr-0
        md:w-90 md:h-90 sm:mt-4 md:pr-0
      `}
    >
      <Spline scene="https://prod.spline.design/SdrzbS97Voe8k4RH/scene.splinecode" />
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
        <div onClick={(e)=> e.stopPropagation()} className="w-[350px] bg-white/90 rounded-2xl shadow-3xl p-6 flex flex-col items-center gap-6 mx-5">
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

function SeeHow() {
  return (
    <div id="seehow" className="relative w-screen flex flex-col items-start px-5 md:py-10 md:mt-0 sm:-mt-5 py-0 pb-5 md:px-10 lg:px-20">
      <div className="text-white text-xl font-bold sm:mb-8 mb-3 lg:ml-25 ml-4">
        See How
      </div>

      <div className="w-full flex justify-around">
        <video
          className="rounded-2xl shadow-lg w-full max-w-4xl"
          controls
          autoPlay
          loop
          muted
        >
          <source src={videoFile} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

function Footer() {
  const isDesktop490 = useMediaQuery("(min-width: 490px)");

  return (
    <div id="contactus" className={`relative z-20 flex ${isDesktop490 ? 'flex-row' : 'flex-col space-y-2 text-sm'} justify-between items-center p-3 mt-5 bg-black/10 backdrop-blur-md shadow-lg rounded-t-sm text-white`}>
      <div>{'\u00A9'} 2025 Schedmate. All rights reserved.</div>

      <div className="flex space-x-4 pr-2">
        <a href="https://twitter.com/shivam_src" target="_blank" rel="noopener noreferrer">
          <FaTwitter size={isDesktop490 ? 24 : 16} />
        </a>

        <a href="https://t.me/shivamsrc" target="_blank" rel="noopener noreferrer">
          <FaTelegramPlane size={isDesktop490 ? 24 : 16} />
        </a>

        <a href="mailto:shivamkumareng7@gmail.com">
          <FaEnvelope size={isDesktop490 ? 24 : 16} />
        </a>
      </div>
    </div>
  );
}