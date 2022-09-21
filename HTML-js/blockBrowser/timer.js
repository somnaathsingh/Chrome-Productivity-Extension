
chrome.runtime.onMessage.addListener(timer);

function timer(request) {
    //console.log(request);
    if (request.txt =="blockBrowserTimer_count") {
        //console.log(request.value);
        blockTime=request.value;
        let t = blockTime;
        let hour = Math.floor(t / 3600);
        t = t % 3600;
        let min = Math.floor(t / 60);
        let sec = t % 60;
        hour = hour < 10 ? '0' + hour : hour;
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        
        if (blockTime == -1) {
            blockCountDown.innerHTML = "Browser has Been Blocked";
        }
        else
        {
            blockCountDown.innerHTML = `${hour}:${min}:${sec}`;
            unlockCountDown.innerHTML = "Unlock Timer will start after the countdown";
        }
    }
    else if(request.txt=="unlockBrowserTimer_count"){

        unlockTime=request.value;
        let t = unlockTime;
        let hour = Math.floor(t / 3600);
        t = t % 3600;
        let min = Math.floor(t / 60);
        let sec = t % 60;
        hour = hour < 10 ? '0' + hour : hour;
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        
        if (unlockTime == -1) {
            blockCountDown.innerHTML = "";
            unlockCountDown.innerHTML = "Browser has been Unblocked";
        }
        else
        {
            blockCountDown.innerHTML = "Browser has Been Blocked";
            unlockCountDown.innerHTML = `${hour}:${min}:${sec}`;
        }

    }
}