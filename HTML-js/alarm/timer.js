
chrome.runtime.onMessage.addListener(timer);

function timer(request) {
    if (request.txt = "timer_count") {
        //console.log(request.value);
        time=request.value;
        let t = time;
        let hour = Math.floor(t / 3600);
        t = t % 3600;
        let min = Math.floor(t / 60);
        let sec = t % 60;
        hour = hour < 10 ? '0' + hour : hour;
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        
        if (time == -1) {
            pausebtn.style.display = "none";
            countdown.innerHTML = "Time's up";
        }
        else
        {
            countdown.innerHTML = `${hour}:${min}:${sec}`;
        }
    }
}