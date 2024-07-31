import { useEffect } from "react";
import screenfull from "screenfull";

const detectMob = () => {
    const mobileRegex = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
    ];
    return mobileRegex.some((regex) => navigator.userAgent.match(regex));
};

const useFullScreen = () => {
    useEffect(() => {
        if (detectMob() && screenfull.isEnabled) {
            screenfull.request();
        }
    }, []);
};

export default useFullScreen;
