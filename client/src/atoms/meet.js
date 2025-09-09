import { atom } from "recoil";

export const MeetAtom = new atom({
    key : "meet",
    default: {start: "", end: "", requestedTo: "", selectedDate: ""}
})