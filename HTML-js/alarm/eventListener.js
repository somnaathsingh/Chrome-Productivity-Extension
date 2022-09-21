let btn = form.button1;
btn.addEventListener('click', () => {

    formDisplay = false;
    form.style.display = "none";
    resetbtn.style.display = "";
    pausebtn.style.display = "";

    let h1 = form.hour_1.value;
    let m1 = form.min_1.value;
    let s1 = form.sec_1.value;
    let label=form.label.value;

    time = (parseInt(h1)) * 60 * 60;
    time += (parseInt(m1)) * 60;
    time = parseInt(time) + parseInt(s1);
    console.log(time);

    let msg = {
        txt: "timer",
        value: time,
        label: label
    }

    chrome.runtime.sendMessage(msg);
});

pausebtn.addEventListener('click', () => {

    if (pause == false) {
        pausebtn.value = "RESUME";
        pause = true;
        let msg = {
            txt: "timer_pause",
            value: time,
        }

        chrome.runtime.sendMessage(msg);
    }
    else {
        pausebtn.value = "PAUSE";
        pause = false;
        let msg = {
            txt: "timer_resume",
            value: time,
            formDisplay: false,
        }

        chrome.runtime.sendMessage(msg);
    }
});

resetbtn.addEventListener('click', () => {
    form.style.display = "";
    form.hour_1.value = 0;
    form.min_1.value = 0;
    form.sec_1.value = 0;
    form.label.value="";

    resetbtn.style.display = "none";
    pausebtn.style.display = "none";
    countdown.innerHTML = "";
    
    let msg={
        txt:"timer_reset"
    }

    chrome.runtime.sendMessage(msg);
});