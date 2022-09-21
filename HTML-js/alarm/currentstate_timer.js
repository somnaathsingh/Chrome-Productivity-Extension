let form = document.querySelector('form');
let countdown = document.querySelector('.countdown');
let resetbtn = document.querySelector('.reset');
let pausebtn = document.querySelector('.pause');

let bgpage = chrome.extension.getBackgroundPage();

let time = bgpage.stime;
let formDisplay = bgpage.formDisplay;
let timerDisplay = bgpage.timerDisplay;
let pauseDisplay=bgpage.pauseDisplay;
let onlyResetDisplay=bgpage.onlyResetDisplay;

let pause = false;


if (formDisplay == true) {
    form.style.display=""
    form.label.value="";
}
else {
    form.style.display = "none";
}

if (timerDisplay == true) {
    resetbtn.style.display = "";
    let t = time;
    let hour = Math.floor(t / 3600);
    t = t % 3600;
    let min = Math.floor(t / 60);
    let sec = t % 60;
    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    if(time>=0)
        countdown.innerHTML = `${hour}:${min}:${sec}`;
    else
        countdown.innerHTML="Time's up";

    if(onlyResetDisplay==true)
    {
        pausebtn.style.display="none";
        pause=false;
    }
    else if(pauseDisplay==false)
    {
        pausebtn.style.display="";
        pausebtn.value="RESUME";
        pause=true;
    }
    else
    {
        pausebtn.style.display="";
        pause=false;
    }

}
else {
    countdown.innerHTML = "";
    pausebtn.style.display = "none";
    resetbtn.style.display = "none";
}
