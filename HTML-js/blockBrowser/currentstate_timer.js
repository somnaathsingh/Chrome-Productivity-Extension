let form = document.querySelector('.browserForm');
let blockCountDown = document.querySelector('.blockcountdown');
let unlockCountDown = document.querySelector('.unlockcountdown');
let resetbtn = document.querySelector('.reset');

let bgpage = chrome.extension.getBackgroundPage();

let blockTime = bgpage.blockBrowserTime;
let unlockTime = bgpage.unlockBrowserTime;
let formDisplay = bgpage.formDisplay_browser;
let timerDisplay = bgpage.timerDisplay_browser;


if (formDisplay == true) {
    form.style.display=""
}
else {
    form.style.display = "none";
}

if (timerDisplay == true) {
    resetbtn.style.display = "";

    let t = blockTime;
    let hour = Math.floor(t / 3600);
    t = t % 3600;
    let min = Math.floor(t / 60);
    let sec = t % 60;
    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    let Ut = unlockTime;
    let Uhour = Math.floor(Ut / 3600);
    Ut = Ut % 3600;
    let Umin = Math.floor(Ut / 60);
    let Usec = Ut % 60;
    Uhour = Uhour < 10 ? '0' + Uhour : Uhour;
    Umin = Umin < 10 ? '0' + Umin : Umin;
    Usec = Usec < 10 ? '0' + Usec : Usec;

    if(blockTime>=0)
    {
        blockCountDown.innerHTML = `${hour}:${min}:${sec}`;
        unlockCountDown.innerHTML= `Unlock Timer will start after the countdown`;

    }
    else if(blockTime==-1 && unlockTime>=0){
        blockCountDown.innerHTML="Browser has been Blocked";
        unlockCountDown.innerHTML=`${Uhour}:${Umin}:${Usec}`;
    }
    else{
        blockCountDown.innerHTML="";
        unlockCountDown.innerHTML=`Browser has been Unblocked`;
    }

    

}
else {
    blockCountDown.innerHTML = "";
    unlockCountDown.innerHTML = "";
    resetbtn.style.display = "none";
}
