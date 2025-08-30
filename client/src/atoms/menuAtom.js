import {atom} from "recoil";
import { useState, useEffect } from "react";

export const MenuAtom = new atom({
    key: "menu",
    default: false
});

export const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(true);

    useEffect(() => {
        const media = window.matchMedia(query);    // returns an object that have {matches: boolean}
        if(media.matches !== matches){
            setMatches(media.matches)                                     
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener);        // cleanup function
    }, [matches, query])

    return matches;
};