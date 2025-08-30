import {atom} from "recoil";
import { useState, useEffect } from "react";

export const SpinnerAtom = new atom({
    key: "spinner",
    default: true
});